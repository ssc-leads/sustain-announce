# MIT Sustain Announce - Documentation

## Introduction

MIT Sustain Announce is a semi-automated system designed to streamline the process of collecting, organizing, and disseminating information about sustainability-related events and opportunities at MIT. The app serves several key functions:

1. Collect submissions about MIT sustainability events and opportunities through a user-friendly form.
2. Generate weekly HTML content for email digests of upcoming events and opportunities.
3. Create a CSV file for easy import into calendar applications, keeping the MIT Sustainability Events and Opportunities shared/public Google Calendar up-to-date.
4. Provide an internal admin database page for monitoring submissions, including those requested to run for longer than two weeks or requiring social media publicity.

This project is inspired by the Graduate Student Council (GSC) Anno system, which generates a similar weekly newsletter for the MIT graduate student community. We extend our gratitude to Eric Lu for sharing the GSC anno files and system, and to Raunak Chowdhuri for his substantial assistance in developing this tool.

## Getting Started

To set up the project for local development and testing, follow these steps:

1. Clone the GitHub repository:
   ```
   git clone https://github.com/your-repo/mit-sustain-announce.git
   cd mit-sustain-announce
   ```

2. Ensure you have Node.js and npm installed. If not, download and install them from [nodejs.org](https://nodejs.org/).

3. Install Bun:
   ```
   curl -fsSL https://bun.sh/install | bash
   ```

4. Install project dependencies:
   ```
   bun i
   ```

5. Start the development server:
   ```
   bun run dev
   ```

6. Link the project to Vercel and pull environment variables (first-time setup):
   ```
   bunx vercel link  # Sign in with ssc-leads@mit.edu when prompted
   bunx vercel env pull .env.development.local
   ```

## Codebase Structure

The MIT Sustain Announce app uses React for the frontend and Node.js with tRPC for the backend. TypeScript is used throughout for type safety. Here's an overview of the key components:

### Frontend

The frontend is built with React, a popular JavaScript library for building user interfaces. It uses TypeScript for added type safety.

Key files:

- `src/pages/submit/index.tsx`: The form for submitting events and opportunities.
- `src/pages/index.tsx`: The homepage, which generates the email digest and calendar CSV.
- `src/pages/database/index.tsx`: The admin page for viewing and managing submissions.

### Backend

The backend uses tRPC, which allows for end-to-end typesafe APIs. It handles data storage and retrieval using Vercel KV (a key-value database).

Key files:

- `src/server/api/routers/submissionsRouter.ts`: Defines the API endpoints for submitting and retrieving data.
- `src/lib/formSchema.ts`: Defines the structure and validation rules for form submissions.

### How it all works together

1. Users submit data through the form (`submit/index.tsx`).
2. The form data is validated using the schema defined in `formSchema.ts`.
3. The validated data is sent to the backend via tRPC.
4. The `submissionsRouter.ts` handles storing the data in the Vercel KV database.
5. The homepage (`index.tsx`) retrieves the stored data and generates the email digest and calendar CSV.
6. The database page (`database/index.tsx`) allows admins to view and manage all submissions.

### Editing the app

To make changes to the app:

1. Form Submission (`src/pages/submit/index.tsx`): Edit this file to modify the structure or fields of the submission form.

2. Form Schema (`src/lib/formSchema.ts`): Update this file to change the validation rules or structure of the form data.

3. Database View (`src/pages/database/index.tsx`): Modify this file to change how the admin database page looks or functions.

4. Homepage/Generation (`src/pages/index.tsx`): Edit this file to alter how the email digest and calendar CSV are generated.

5. API Endpoints (`src/server/api/routers/submissionsRouter.ts`): Update this file to change how data is stored or retrieved from the database.

Remember to test your changes locally using `bun run dev` before deploying to production.
