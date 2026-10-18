import { career, languages, layers } from "@/content/profile";

export function Stack() {
  const degree = career.find((r) => r.kind === "study");

  return (
    <section id="stack" className="border-t border-rule py-24">
      <div className="mx-auto max-w-[1240px] gutter">
        <div className="grid gap-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-x-6">
          <h2 className="wide text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Stack
          </h2>
          <p className="max-w-[52ch] self-end text-lg leading-relaxed text-muted">
            Grouped by where it sits in the systems I build, from the channel a customer writes in down to the
            cloud it runs on.
          </p>
        </div>

        <ol className="relative mt-14">
          {/* request path */}
          <span className="absolute top-8 bottom-8 left-[7px] w-px bg-rule md:left-[calc(300px+1.5rem-0.5px)]" aria-hidden />
          {layers.map((layer) => (
            <li
              key={layer.name}
              className="group relative grid gap-x-6 gap-y-2 border-b border-rule py-6 pl-8 md:grid-cols-[300px_minmax(0,1fr)] md:pl-0"
            >
              <span
                className="absolute top-[34px] left-[3px] size-[9px] rounded-full border border-faint bg-ink transition-colors group-hover:border-signal group-hover:bg-signal md:left-[calc(300px+1.5rem-4.5px)]"
                aria-hidden
              />
              <h3 className="text-lg font-semibold md:pt-0.5">{layer.name}</h3>
              <ul className="flex flex-wrap gap-x-7 gap-y-2 md:pl-8">
                {layer.items.map((item) => (
                  <li key={item} className="wide text-[clamp(1.15rem,2vw,1.6rem)] font-medium tracking-[-0.02em] text-muted transition-colors hover:text-text">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-sm text-faint">Education</h3>
            <p className="mt-2 font-medium">{degree?.title}</p>
            <p className="text-muted">{degree?.org}, 2023</p>
          </div>
          <div>
            <h3 className="text-sm text-faint">Certificates</h3>
            <p className="mt-2 font-medium">Azure AI Fundamentals (AI-900)</p>
            <p className="text-muted">Google Professional Data Analysis</p>
          </div>
          <div>
            <h3 className="text-sm text-faint">Languages</h3>
            {languages.map((l) => (
              <p key={l.name} className="mt-2 first-of-type:mt-2">
                <span className="font-medium">{l.name}</span> <span className="text-muted">{l.level}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
