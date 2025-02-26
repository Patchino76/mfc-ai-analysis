This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Frontend Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Backend Setup

The project includes a Python backend using FastAPI and LangGraph for AI-powered data analysis:

1. Install Python dependencies:
```bash
cd python
pip install -r ../requirements.txt
```

2. Set up environment variables:
Create a `.env` file in the `python` directory with the following variables:
```
ENVIRONMENT=development
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

3. Run the FastAPI server:
```bash
cd python
python fast_api.py
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

- `/app`: Next.js frontend
- `/python`: Python backend
  - `fast_api.py`: FastAPI server implementation
  - `chat_agents.py`: LangGraph workflow for AI-powered data analysis
  - `data_questions.py`: Data analysis and question handling
  - `/data`: Data sources and processing utilities

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
