# API Documentation

## Overview

This directory contains all API routes for the portfolio website. Each route is implemented using Next.js App Router API routes.

## Available Endpoints

### Contact Form (`/api/contact`)

Handles contact form submissions.

**POST /api/contact**

Request body:

```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

Response (success):

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

Response (error):

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["error message"]
  },
  "statusCode": 400
}
```

Error Codes:

- 400: Bad Request (missing or invalid fields)
- 500: Server Error (email sending failed)

## Error Handling

All API routes use the standardized error handling from `@/utils/api-error.ts`:

```typescript
import { createAPIError, handleAPIError } from '@/utils/api-error'

try {
  // API logic here
  throw createAPIError(400, 'Invalid input', {
    field: ['Error message'],
  })
} catch (error) {
  const errorResponse = handleAPIError(error)
  return NextResponse.json(errorResponse, {
    status: errorResponse.statusCode,
  })
}
```

## Testing API Routes

API routes can be tested using Jest and the built-in Next.js testing utilities:

```typescript
import { createMocks } from 'node-mocks-http'
import { POST } from './route'

describe('Contact API', () => {
  it('handles valid input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
})
```
