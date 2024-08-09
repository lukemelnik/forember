# Forember - An AI-powered Spaced Repetion App

---

![A picture of the Forember dashboard](./forember-dashboard.png)

---

## Installation

1. Clone the repo:

```
git clone git@github.com:lukemelnik/forember.git
```

2. Install dependencies:

```
npm install
```

3. [Grab an OpenAI API key](https://platform.openai.com/).

- Add your OPENAI_API_KEY, OPENAI_ORGANIZATION_ID & OPENAI_PROJECT_ID to a .env.local file (see .env.example for reference)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. [Sign up for Supabase](https://supabase.com)

- Create a database
- Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the .env.local file

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORGANIZATION_ID=your_openai_organization_id_here
OPENAI_PROJECT_ID=your_openai_project_id_here
```

5. Apply the most recent migration to your database

6. Start the development server:

```
npm run dev
```

## Tech used

React, Next.js, Node.js, PostgreSQL, Supabase, TailwindCSS, Shadcn Components, Vercel, OpenAI
