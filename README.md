# MIT Sustain Announce - Documentation

## Introduction

MIT Sustain Announce is a semi-automated system designed to streamline the process of collecting, organizing, and disseminating information about sustainability-related events and opportunities at MIT. The app serves several key functions:

1. Collect submissions about MIT sustainability events and opportunities through a user-friendly form.
2. Generate weekly HTML content for email digests of upcoming events and opportunities.
3. Create a CSV file for easy import into calendar applications, keeping the MIT Sustainability Events and Opportunities shared/public Google Calendar up-to-date.
4. Provide an internal admin database page for monitoring submissions, including those requested to run for longer than two weeks or requiring social media publicity.

This project is inspired by the Graduate Student Council (GSC) Anno system, which generates a similar weekly newsletter for the MIT graduate student community. We extend our gratitude to Eric Lu for sharing examples of the GSC anno files and explaining the system, and to Raunak Chowdhuri for his substantial assistance in developing this tool.

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

## Using the App

### Using the Submissions Form

The submissions form can be accessed at [sustain-announce.vercel.app/submit](https://sustain-announce.vercel.app/submit) in production, or at `localhost:3000/submit` (or the port specified when running `bun run dev`) in development.

Users should submit this form for each individual event or opportunity they want to add. SSC co-leads can share the form link when receiving publicity requests, advertise it on their website, social media, etc. Admins can also manually submit events based on email requests if users cannot fill out the form themselves.

The form enforces completion of all required fields and validates inputs (e.g., valid email, URL). Some options have conditional logic, causing other fields to appear/disappear or become required/optional, such as "Type of Submission" and "Event/Opportunity Options".

Note: In development, append `/submit` to the URL provided by the terminal to view the submission form.

### Managing Submissions in the Database

The database page is available at [sustain-announce.vercel.app/database](https://sustain-announce.vercel.app/database) or `localhost:3000/database` in development.

Before generating the email/calendar template, review all submissions on this page:

1. Enter a cutoff date to view relevant submissions.
2. Review highlighted submissions:
   - Red: Requested to run for longer than 2 consecutive weeks
   - Green text: Social media requests
3. Delete any spam/duplicate submissions using the "Delete" button.
   - Note: There's no version history, so only delete when absolutely certain.
4. For detailed edits or viewing all fields, download the CSV using the button at the bottom.
   - Use this to edit/resubmit a submission if needed, then delete the original.
   - For minor edits (typos, formatting), it's recommended to edit the generated HTML/CSV directly.

Note: In development, append `/database` to the URL provided by the terminal to access this page.

### Generating the Email and Calendar Templates

Access the generation page at [sustain-announce.vercel.app](https://sustain-announce.vercel.app) or `localhost:3000` in development.

To generate email HTML and calendar CSV:

1. Input the desired digest date (typically Monday during the academic year).
2. Verify the daylight/standard time zone toggle (auto-set, but can be manually adjusted).
3. Optionally add additional text for the email (e.g., specific updates).
4. Click "Generate".
5. Review the email HTML preview for accuracy.
6. Copy the HTML code and paste it into the Engage email builder using the "Source" option.
7. Preview in Engage and make minor edits to HTML to fix formatting, typos, etc if needed.*
8. Download the calendar CSV file using the provided button.
9. Always open and review the CSV file locally, delete rows for any previously imported events, and make necessary edits to events as needed (location, time, title, description, etc can all easily be edited in the CSV).
10. Import the CSV to the shared "MIT Sustainability Opportunities" Google Calendar.

*If you don't know how to edit HTML, you can ask an AI assistant like Claude.AI, ChatGPT,  Gemini etc to make the changes you describe to the code and test it in your preview email until the desired changes are made. 

Note: If using a regular email client like Gmail or Outlook (not recommended as Engage has more consistent HTML rendering and other benefits as described in the SSC Living Wiki), copy the rendered email preview from the app (NOT the HTML code) and paste it into the email client. Then verify that it is displaying properly and send a test email if needed to check on mobile and various email clients.

## Editing the App

### Editing Source Code

To make changes to the app:

1. Form Submission (`src/pages/submit/index.tsx`): Edit this file to modify the structure or fields of the submission form.

2. Form Schema (`src/lib/formSchema.ts`): Update this file to change the validation rules or structure of the form data.

3. Database View (`src/pages/database/index.tsx`): Modify this file to change how the admin database page looks or functions.

4. Homepage/Generation (`src/pages/index.tsx`): Edit this file to alter how the email digest and calendar CSV are generated.

5. API Endpoints (`src/server/api/routers/submissionsRouter.ts`): Update this file to change how data is stored or retrieved from the database.

Remember to test your changes locally using `bun run dev` before deploying to production.

### Pushing Code Changes

To push code changes:

1. Ensure you have been added as a collaborator to the [GitHub repository](https://github.com/your-repo/mit-sustain-announce).
2. The repository is owned by the account using ssc-leads@mit.edu (login info in the SSC Living Wiki).
3. Note: This repo is not in the [MIT SSC GitHub Organization](https://github.com/mit-scc) due to Vercel deployment restrictions.

### Accessing the Backend

To access the backend:

1. Sign in to [Vercel](https://vercel.com) using the credentials in the SSC Living Wiki (username: ssc-leads@mit.edu).
2. Periodically check to ensure correct deployment, view production URLs, access the KV database, and check for build errors.
3. If you receive emails about app updates or production failures, check Vercel for error messages.
   - Common issues often relate to package installations or accidental pushing of local packages/environments.
   - Resolve by updating .gitignore and reinstalling packages as needed.

## Codebase Structure

The MIT Sustain Announce app uses React for the frontend and Node.js with tRPC for the backend. TypeScript is used throughout for type safety. Here's an overview of the key components:

### Frontend

The frontend is built with React, a popular JavaScript library for building user interfaces. It uses TypeScript for added type safety.

Key files:

- `src/pages/submit/index.tsx`: The form for submitting events and opportunities. Note: This file contains the `USE_DEFAULT_VALUES` variable, which should be set to `true` for testing (auto-fills the form) and `false` for production.
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