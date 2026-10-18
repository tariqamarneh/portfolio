import type { Article } from "../writing";

export const memoryLeak: Article = {
  slug: "grpc-contextvars-memory-leak",
  title: "The leak the garbage collector couldn't see",
  description:
    "How a gRPC client built inside each agent turn pinned whole LangGraph graphs in memory, and the jemalloc profiles and gc referrer walks that found it.",
  published: "2026-10-18",
  tags: ["Python", "Memory leak", "gRPC", "LangGraph", "Cloud Run"],
  body: [
    {
      type: "p",
      text: "On the day we moved every business onto a new agent runtime, our Python service started growing in a straight line. Each conversation left about 1.3–2.2 MB behind. One busy instance went from 434 MB to 1,153 MB in 50 minutes, and instances with a 2 GB limit crossed 90% within the hour. We doubled the limit to buy time and went looking.",
    },
    {
      type: "stats",
      items: [
        { label: "Before", value: "1.3–2.2 MB", note: "retained per conversation" },
        { label: "After", value: "~0.05 MB", note: "per conversation, flat over 330+ sessions" },
        { label: "Fix", value: "2 days", note: "from first alert to the fix in production" },
      ],
    },
    { type: "h2", text: "The first clue: who was growing" },
    {
      type: "p",
      text: "The service runs two kinds of instances: the ones answering WhatsApp messages, and background workers sharing the same code and libraries. The workers handled more messages but grew at about a tenth of the rate. Shared infrastructure, like database pools and HTTP clients, would have leaked on both. So the leak was somewhere in the path the conversational turn takes through the agent graph.",
    },
    { type: "h2", text: "Measure in production, not on your laptop" },
    {
      type: "p",
      text: "My first local repro with `tracemalloc` and `memray` was useful. It showed each new HTTPS client re-parsing the system CA store, which we fixed by sharing one `ssl.SSLContext`. It also cost me hours. The local virtualenv was pinned by `uv.lock`, while the Docker image installed `requirements.txt` with different LangSmith and LangGraph versions. I was carefully profiling code that wasn't running in production.",
    },
    {
      type: "callout",
      text: "**Lesson:** before profiling a leak locally, check that you're running the exact library versions from the production image. Better, build the image and profile that.",
    },
    {
      type: "p",
      text: "So I moved the instruments into production instead, one small PR at a time:",
    },
    {
      type: "list",
      items: [
        "A `memory_sample` log line every minute: RSS against the container's cgroup limit.",
        "glibc `mallinfo2` stats. In-use memory grew while free heap stayed flat, so this was real retained memory, not allocator fragmentation. That killed my favourite theory.",
        "An open file-descriptor count, and a tracker that grouped gRPC channels by where they were created.",
        "jemalloc built with profiling, loaded through `LD_PRELOAD`, dumping heap profiles every 15 minutes. Diffing them with `jeprof` pointed at gRPC's native layer: about 130 MB an hour.",
      ],
    },
    { type: "h2", text: "Following the references home" },
    {
      type: "p",
      text: "jemalloc said *where* the bytes were allocated. To learn *why* they stayed alive, I wrote a small retention probe: take a live object that should have died at the end of a turn, then walk `gc.get_referrers()` back until reaching something that never dies. Twenty-five minutes after startup, one instance held 84 compiled graphs, 11,701 LangSmith run trees and 71 search clients. The same chain appeared on 8 instances across two rounds:",
    },
    {
      type: "code",
      lang: "text",
      code: `compiled graph
  ← RunTree.inputs
  ← tracer run_map
  ← contextvars.Context
  ← grpc _Plugin._stored_ctx      # held by native code`,
      caption: "The retention chain, from the leaked graph to the gRPC credentials plugin.",
    },
    { type: "h2", text: "Root cause" },
    {
      type: "p",
      text: "On every product-search turn the code built a new search client, and each client opened two gRPC channels. When gRPC sets up call credentials, its auth plugin calls `contextvars.copy_context()` and stores the copy. The copy lives in the native channel, so Python's garbage collector can't trace it as a root.",
    },
    {
      type: "p",
      text: "Inside an agent turn, that context isn't empty. It carries the LangSmith run tree, the LangChain callbacks and config, and through them the whole compiled graph. Every turn quietly pinned one of each, forever. It also explained an early experiment that made no sense at the time: turning tracing off didn't stop the growth, because the run config alone was enough to keep the graph alive.",
    },
    { type: "h2", text: "The fix" },
    {
      type: "p",
      text: "Clients that open network channels should live as long as the process, not the request. I replaced the per-turn constructor with a process-wide cache keyed by configuration. The client is built inside a fresh, empty context, so whatever gRPC copies holds nothing from the turn:",
    },
    {
      type: "code",
      lang: "python",
      code: `_SHARED_CLIENTS: dict[tuple, SearchClient] = {}
_LOCK = threading.Lock()

def get_search_client(**cfg) -> SearchClient:
    key = tuple(sorted(cfg.items()))
    if (client := _SHARED_CLIENTS.get(key)) is None:
        with _LOCK:
            if (client := _SHARED_CLIENTS.get(key)) is None:
                # Build outside the request's context: gRPC keeps a copy of it.
                client = contextvars.Context().run(SearchClient, **cfg)
                _SHARED_CLIENTS[key] = client
    return client`,
      caption: "Before: `SearchClient(...)` inside each turn, at three call sites.",
    },
    {
      type: "p",
      text: "Forty minutes after the deploy, patched instances grew 17–27 MB over 330–350 conversations, while instances still on the old build grew 528–612 MB in the same window. jemalloc's allocated bytes went flat, open file descriptors held steady around 130, and each instance kept exactly one search client. A month later we set the memory limit back to 2 GB.",
    },
    { type: "h2", text: "What I'd tell my past self" },
    {
      type: "list",
      items: [
        "Compare the parts of the system that leak with the parts that don't. It narrows the search faster than any profiler.",
        "Put cheap, permanent instruments in production early. A per-minute memory line and allocator stats settled arguments that local repros kept reopening.",
        "Allocation profilers show where memory came from; a referrer walk shows what's keeping it. You usually need both.",
        "Anything holding sockets or channels (gRPC, HTTP pools, SDK clients) belongs at process scope. Building it inside a request also captures that request's context.",
      ],
    },
  ],
};
