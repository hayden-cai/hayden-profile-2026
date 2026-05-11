export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "why-i-switched-to-mastra",
    title: "Why I switched from LangChain to Mastra for AI engineering",
    excerpt: "After exploring the Python-heavy LangChain ecosystem, I made the switch to Mastra — a TypeScript-first AI agent framework. Here's what I learned.",
    date: "May 2026",
    readTime: "5 min read",
    tag: "AI",
    content: `## The Problem with LangChain for TypeScript Developers\n\nLangChain is powerful, but it's Python-first. As a TypeScript developer, the DX friction was real.\n\n## Enter Mastra\n\nMastra is built from the ground up for TypeScript with first-class support for agents, tools, and RAG pipelines.\n\n## Final Thoughts\n\nIf you're a TypeScript developer building AI products, Mastra is worth exploring.`,
  },
  {
    slug: "graphql-bff-pattern",
    title: "GraphQL + BFF Pattern: lessons from building banking features",
    excerpt: "How we used a Backend-for-Frontend architecture with TypeGraphQL to optimize API consumption at Bendigo Bank.",
    date: "Mar 2025",
    readTime: "7 min read",
    tag: "Architecture",
    content: `## What is the BFF Pattern?\n\nA Backend-for-Frontend is a dedicated API layer built specifically for a single frontend.\n\n## Why We Chose GraphQL + TypeGraphQL\n\nTypeGraphQL lets you define your GraphQL schema using TypeScript classes and decorators.\n\n## The Result\n\nAPI response times dropped significantly and the frontend team moved faster.`,
  },
  {
    slug: "rag-systems-explained",
    title: "RAG systems explained: how I built my first retrieval-augmented pipeline",
    excerpt: "A practical walkthrough of building a RAG system — from document ingestion to semantic search to LLM response generation.",
    date: "Jan 2025",
    readTime: "8 min read",
    tag: "AI",
    content: `## What is RAG?\n\nRetrieval-Augmented Generation grounds LLM responses in real data by retrieving relevant documents.\n\n## The Pipeline\n\n1. Ingest — chunk and embed documents\n2. Retrieve — semantic search\n3. Generate — pass chunks as context to the LLM`,
  },
  {
    slug: "react-performance-tips",
    title: "5 React performance patterns I use every day",
    excerpt: "From memoization to virtualization, these are the patterns that actually move the needle on large React applications.",
    date: "Oct 2024",
    readTime: "6 min read",
    tag: "React",
    content: `## 1. useMemo and useCallback\n\nPremature memoization is a real problem. Profile first, optimize second.\n\n## 2. Code splitting\n\nRoute-level splitting is table stakes.\n\n## 3. Virtualization\n\nreact-window for any list over 100 items.`,
  },
  {
    slug: "typescript-utility-types",
    title: "TypeScript utility types you should be using in 2025",
    excerpt: "A deep dive into Partial, Required, Pick, Omit, and lesser-known utility types that make your TypeScript code more expressive.",
    date: "Feb 2025",
    readTime: "6 min read",
    tag: "TypeScript",
    content: `## Why Utility Types Matter\n\nUtility types let you transform existing types instead of duplicating them.\n\n## The Essentials\n\nPartial, Required, Pick, Omit, Record, Extract, Exclude.\n\n## Lesser Known Gems\n\nNoInfer, Awaited, and template literal types.`,
  },
  {
    slug: "tailwindcss-architecture",
    title: "Scaling TailwindCSS in a large design system",
    excerpt: "How to structure Tailwind in a monorepo with shared tokens, component variants, and consistent theming across multiple apps.",
    date: "Nov 2024",
    readTime: "7 min read",
    tag: "TailwindCSS",
    content: `## The Problem at Scale\n\nTailwind works great for small projects but can get messy in large teams.\n\n## Design Tokens\n\nExtracting tokens into a shared config keeps consistency.\n\n## Component Variants with CVA\n\nClass Variance Authority pairs perfectly with Tailwind.`,
  },
  {
    slug: "css-container-queries",
    title: "CSS Container Queries: the future of responsive design",
    excerpt: "Why container queries are a game-changer and how to start using them today in production with progressive enhancement.",
    date: "Sep 2024",
    readTime: "5 min read",
    tag: "CSS",
    content: `## What Are Container Queries?\n\nContainer queries let you style elements based on their parent's size, not the viewport.\n\n## Why This Matters\n\nComponents can now be truly portable and self-contained.\n\n## Browser Support\n\nAll modern browsers support container queries as of 2023.`,
  },
  {
    slug: "nextjs-app-router",
    title: "Next.js App Router: what I learned after 6 months in production",
    excerpt: "Real-world lessons from migrating a large codebase to the Next.js App Router — including gotchas, wins, and performance improvements.",
    date: "Aug 2024",
    readTime: "9 min read",
    tag: "Next.js",
    content: `## The Migration\n\nMoving from Pages Router to App Router is not trivial but worth it.\n\n## Server Components\n\nThe mental model shift is the hardest part — once it clicks, it's powerful.\n\n## Performance Wins\n\nStreaming and Suspense changed how we think about loading states.`,
  },
  {
    slug: "design-systems-storybook",
    title: "Building a design system with Storybook and TypeScript",
    excerpt: "A practical guide to building a scalable component library with Storybook, TypeScript, and automated visual regression testing.",
    date: "Jul 2024",
    readTime: "8 min read",
    tag: "Design Systems",
    content: `## Why Storybook?\n\nStorybook gives you a living document for your component library.\n\n## Structure\n\nAtomic design principles work well with Storybook's story hierarchy.\n\n## Visual Regression Testing\n\nChromatic automates screenshot comparisons on every PR.`,
  },
  {
    slug: "web-performance-core-vitals",
    title: "Improving Core Web Vitals: a practical checklist",
    excerpt: "How to systematically improve LCP, FID, and CLS scores on a React application — with real measurements and before/after results.",
    date: "Jun 2024",
    readTime: "7 min read",
    tag: "Performance",
    content: `## Understanding Core Web Vitals\n\nLCP, FID/INP, and CLS are Google's key UX metrics.\n\n## Quick Wins\n\nImage optimization alone can dramatically improve LCP.\n\n## Measuring\n\nUse Lighthouse, WebPageTest, and field data from CrUX.`,
  },
  {
    slug: "aws-lambda-serverless",
    title: "AWS Lambda patterns for full stack developers",
    excerpt: "Practical patterns for using AWS Lambda in full stack applications — from REST APIs to event-driven workflows and scheduled jobs.",
    date: "Apr 2024",
    readTime: "8 min read",
    tag: "Serverless",
    content: `## Why Lambda?\n\nServerless removes infrastructure concerns and scales automatically.\n\n## Common Patterns\n\nREST API via API Gateway, event-driven with SQS, scheduled with EventBridge.\n\n## Cold Starts\n\nProvisioned concurrency eliminates cold starts for critical paths.`,
  },
  {
    slug: "fullstack-shopify",
    title: "Building headless Shopify storefronts with Next.js",
    excerpt: "How to build a performant headless Shopify storefront using Next.js, the Storefront API, and Algolia for search.",
    date: "Mar 2024",
    readTime: "9 min read",
    tag: "Full-Stack",
    content: `## Why Headless?\n\nHeadless gives you full control over UX while leveraging Shopify's commerce infrastructure.\n\n## The Stack\n\nNext.js + Shopify Storefront API + Algolia + Prismic for CMS.\n\n## Performance\n\nISR and edge caching make headless storefronts lightning fast.`,
  },
];