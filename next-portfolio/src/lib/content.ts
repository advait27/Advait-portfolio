/**
 * SINGLE SOURCE OF TRUTH for all site content.
 *
 * Every section reads its copy, links, dates, and figures from here. To update the
 * portfolio (projects, articles, podcasts, experience, contact), edit this file only —
 * components contain no hardcoded copy.
 *
 * Content fidelity is intentional: figures and descriptions are final and verbatim.
 */

export const SITE = {
  name: "Advait Dharmadhikari",
  role: "AI Strategy & Forward Deployed Engineer",
  shortRole: "AI Strategy & Forward Deployed Engineer",
  baseUrl: "https://advaitdharmadhikari.netlify.app",
  email: "advaitdharmadhikari27@gmail.com",
  phone: "+353 89 204 0580",
  location: "Dublin, Ireland",
  availability: "Open to consulting",
  resumePath: "/Advait_Dharmadhikari.pdf",
} as const;

/** ONE canonical LinkedIn URL used everywhere. */
export const LINKEDIN_URL = "https://www.linkedin.com/in/advaitdharmadhikari2710";

export const LINKS = {
  linkedin: LINKEDIN_URL,
  github: "https://github.com/advait27",
  medium: "https://medium.com/@advaitdharmadhikari7",
  instagram: "https://www.instagram.com/mr.maverick27",
  spotifyBusinessTechnologist: "https://open.spotify.com/show/2nMlpUNSqh9ZiI1vsg5B1g",
  spotifyBoosters: "https://open.spotify.com/show/32D27hJiy5sEZ7RnULzcBS",
} as const;

export const NAV_LINKS = [
  { index: "01", label: "Work", href: "#work" },
  { index: "02", label: "Services", href: "#services" },
  { index: "03", label: "Experience", href: "#experience" },
  { index: "04", label: "Writing", href: "#writing" },
  { index: "05", label: "Contact", href: "#contact" },
] as const;

export const HERO = {
  metaStrip:
    "Advait Dharmadhikari · Portfolio | 2025–2026 Index | Architected · Built · Shipped",
  eyebrow: "— AI Strategy & Forward Deployed Engineer",
  // The headline is split so "Decision" can be rendered in italic ember.
  headline: { lead: "Architecting", emphasis: "Decision", trail: "Systems." },
  subtitle:
    "I turn ambiguous problems into LLM architectures, agentic workflows, and decision products people actually use. MSc Business Analytics @ UCD Smurfit, ex-IndiGo — building production AI grounded in measurable business outcomes.",
  availability: "Open to consulting",
  stats: [
    { value: "300+", label: "Fleet optimised" },
    { value: "90%", label: "LLM cost cut" },
    { value: "30+", label: "Repositories" },
  ],
} as const;

export type Service = {
  index: string;
  title: string;
  description: string;
  pills: string[];
};

export const SERVICES: Service[] = [
  {
    index: "01",
    title: "AI Systems & LLM Architecture",
    description:
      "Designing LLM applications, RAG pipelines, semantic search, and agentic workflows — built for performance, cost, and governance from day one.",
    pills: ["LLM apps", "RAG", "Semantic search", "Agentic workflows"],
  },
  {
    index: "02",
    title: "AI Product Strategy",
    description:
      "Owning product vision and roadmaps end-to-end, from research ingestion to structured outputs, with AI evaluation practices that keep systems reliable.",
    pills: ["Roadmaps", "Structured outputs", "AI evaluation"],
  },
  {
    index: "03",
    title: "Analytics & Decision Intelligence",
    description:
      "KPI design, BI, and decision-support systems that turn operational data into executive-ready, defensible decisions.",
    pills: ["KPI design", "BI", "Decision support"],
  },
  {
    index: "04",
    title: "Digital Transformation & Consulting",
    description:
      "Consulting-style problem solving that bridges business goals with technology adoption, optimisation, and change.",
    pills: ["Adoption", "Optimisation", "Change"],
  },
  {
    index: "05",
    title: "ML & Forecasting",
    description:
      "Predictive modelling, simulation, and cost optimisation with scikit-learn, TensorFlow, and PyTorch — applied to real operational problems.",
    pills: ["scikit-learn", "TensorFlow", "PyTorch", "Simulation"],
  },
];

export type PatternKind = "mesh" | "circles" | "grid" | "lines";

export type Project = {
  index: string;
  title: string;
  category: string;
  status: string;
  year: string;
  href: string;
  description: string;
  tags: string[];
  pattern: PatternKind;
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    index: "01",
    title: "ClawbackVault AI",
    category: "Fintech",
    status: "Production",
    year: "2026",
    href: LINKEDIN_URL,
    description:
      "A privacy-first AI system protecting broker commissions from silent client churn. Targeted-surveillance architecture, a Claude Sonnet 4.6 signal engine across 15+ behavioural categories, and an 80–90% cut in LLM cost per broker.",
    tags: ["Claude Sonnet 4.6", "RAG", "Supabase", "OAuth 2.0"],
    pattern: "mesh",
    accent: "#F37512",
  },
  {
    index: "02",
    title: "HalluciMap",
    category: "GenAI Eval",
    status: "Personal",
    year: "2025",
    href: "https://github.com/advait27/hallucimap",
    description:
      "Detects and maps LLM hallucinations to strengthen AI evaluation and reliability.",
    tags: ["LLM Eval", "Python"],
    pattern: "circles",
    accent: "#c0392b",
  },
  {
    index: "03",
    title: "ChartSense",
    category: "Vision + LLM",
    status: "Personal",
    year: "2025",
    href: "https://github.com/advait27/chartsense",
    description:
      "Turns charts and visual data into structured, queryable insight with AI.",
    tags: ["Vision + LLM", "Python"],
    pattern: "grid",
    accent: "#F2F2EC",
  },
  {
    index: "04",
    title: "Jarvis",
    category: "Agentic AI",
    status: "Personal",
    year: "2024",
    href: "https://github.com/advait27/jarvis",
    description:
      "A personal AI assistant exploring agentic tool use and conversational workflows.",
    tags: ["Agentic AI", "JavaScript"],
    pattern: "lines",
    accent: "#9c4a1a",
  },
];

export const WORK_END_CARD = {
  text: "30+ repositories across AI, ML, finance & analytics",
  href: LINKS.github,
};

export type ArchiveCategory = "AI & LLM" | "Finance" | "Analytics";

export type ArchiveItem = {
  name: string;
  categories: ArchiveCategory[];
  meta?: string;
  href: string;
};

export const PROJECT_ARCHIVE: ArchiveItem[] = [
  { name: "ClawbackVault AI", categories: ["AI & LLM", "Finance"], meta: "Production · Fintech", href: LINKEDIN_URL },
  { name: "HalluciMap", categories: ["AI & LLM"], href: "https://github.com/advait27/hallucimap" },
  { name: "ChartSense", categories: ["AI & LLM"], href: "https://github.com/advait27/chartsense" },
  { name: "Jarvis", categories: ["AI & LLM"], href: "https://github.com/advait27/jarvis" },
  { name: "AI Cost & Growth Optimizer", categories: ["AI & LLM"], href: "https://github.com/advait27/ai-cost-growth-optimizer" },
  { name: "ESGProfiler", categories: ["Finance"], meta: "published package", href: "https://github.com/advait27/ESGProfiler" },
  { name: "Finance-AutoML", categories: ["Finance"], meta: "published package", href: "https://github.com/advait27/finautoml" },
  {
    name: "FinFeatures",
    categories: ["Finance"],
    meta: "published package",
    href: "https://medium.com/@advaitdharmadhikari7/streamlining-financial-feature-engineering-with-finfeatures-9c3683537737",
  },
  { name: "Market Pulse AI", categories: ["Finance"], href: "https://github.com/advait27/market-pulse-AI" },
  { name: "FinPred", categories: ["Finance"], meta: "Streamlit", href: "https://github.com/advait27/finpred_st" },
  { name: "Credit Risk Assessment", categories: ["Analytics"], href: "https://github.com/advait27/Credit-Risk-assessment" },
  { name: "Employee Turnover Analytics", categories: ["Analytics"], href: "https://github.com/advait27/Employee-turnover-analytics" },
];

export type ExperienceItem = {
  index: string;
  role: string;
  org: string;
  location?: string;
  dates: string;
  description: string;
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    index: "01",
    role: "AI Consultant · Founding Engineer",
    org: "Frensei",
    location: "Dublin",
    dates: "May 2026 – Present",
    description:
      "Founding engineer on ClawbackVault AI. Own the end-to-end scrum programme across a 4-phase roadmap and partner with the CEO on product, pricing, and go-to-market. Designed a targeted-surveillance architecture that cut Claude API spend per broker by 80–90%, a privacy-first processing pipeline, and a Claude Sonnet 4.6 signal engine across 15+ behavioural categories — with AES-256-GCM encryption, PII masking, and GDPR compliance built in.",
  },
  {
    index: "02",
    role: "Technical Lead · AI & Product Management",
    org: "Frensei",
    location: "Dublin",
    dates: "Dec 2025 – May 2026",
    description:
      "Led design and execution of Frensei's AI-first intelligence platform from zero to scale. Built agentic systems (planning, execution, verification, feedback), LLM pipelines (RAG, semantic search, long-context reasoning), and AI evaluation practices that cut hallucinations and lifted output consistency by 40%.",
  },
  {
    index: "03",
    role: "Teaching Assistant · Digital Technologies in Business",
    org: "UCD",
    dates: "Jan 2026 – May 2026",
    description:
      "Supported teaching across digital transformation, data-driven decision-making, AI, and analytics. Guided 150+ students through projects, case studies, and presentations on technology-enabled business models.",
  },
  {
    index: "04",
    role: "Business Analytics & ML Mentor",
    org: "topmate.io",
    dates: "Jan 2025 – Present",
    description:
      "Mentor early-career professionals on analytics, ML fundamentals, project framing, and career direction across a global audience.",
  },
  {
    index: "05",
    role: "Business Analyst · Business Technology & Product",
    org: "IndiGo (InterGlobe Aviation)",
    dates: "Jan 2024 – Aug 2025",
    description:
      "Led business analysis and product delivery for operations-control applications across a 300+ aircraft fleet. Led ML-driven optimisation including aircraft zero-fuel-weight prediction and on-time-performance cost models — delivering ~20% operational cost savings.",
  },
  {
    index: "06",
    role: "Business Intelligence Engineer · Business Technology & Product",
    org: "IndiGo",
    dates: "Jun 2023 – Dec 2023",
    description:
      "Owned requirements gathering, solution design, and reporting logic. Delivered production-ready BI in cloud-enabled environments (GCP, Azure) supporting leadership and cross-functional teams.",
  },
  {
    index: "07",
    role: "Business Development Analyst · Team Lead",
    org: "CHRIST Consulting",
    dates: "Jun 2021 – Jun 2022",
    description:
      "Led a 15-member analyst team on market-entry and growth-strategy engagements. Contributed to a 25% increase in new-business acquisition and ~15% improvement in renewals and upsells.",
  },
  {
    index: "08",
    role: "Data Science & Business Analytics Internships",
    org: "IndiGo, LetsGrowMore, The Sparks Foundation, EntryLevel",
    dates: "2020 – 2023",
    description:
      "Early experience in data analysis, predictive modelling, and business analytics across multiple industry-focused projects.",
  },
];

export type EducationItem = {
  index: string;
  degree: string;
  org: string;
  location?: string;
  dates: string;
  description: string;
};

export const EDUCATION: EducationItem[] = [
  {
    index: "01",
    degree: "MSc Business Analytics",
    org: "UCD Michael Smurfit Graduate Business School",
    location: "Dublin",
    dates: "Sep 2025 – Present",
    description:
      "Business optimisation, simulation, predictive analytics, machine learning, and technology consulting.",
  },
  {
    index: "02",
    degree: "PG Professional Certification · AI & Machine Learning",
    org: "IIT Kanpur",
    dates: "Oct 2023 – Jul 2024",
    description:
      "Advanced training in AI and ML with emphasis on deep learning and practical applications.",
  },
  {
    index: "03",
    degree: "BBA · Business Analytics & Data Science",
    org: "Christ University",
    location: "Bangalore",
    dates: "2020 – 2023",
    description:
      "Foundation in business management, strategy, corporate finance, and data-driven decision-making.",
  },
  {
    index: "04",
    degree: "Business / Commerce",
    org: "Ryan International School",
    dates: "May 2018 – Jun 2020",
    description:
      "Business and commerce track with early exposure to analytics and economics.",
  },
];

export const CERTIFICATIONS: string[] = [
  "UCD Advantage Award (Honor)",
  "Data Strategy (Professional Certification)",
  "Google Project Management",
  "BCG Advanced Analytics & Data Science (Virtual Experience)",
  "Data Visualization & Analytics",
  "Relational Data on Azure (Microsoft)",
  "Google Business Intelligence",
];

export const ABOUT = {
  headline: { line1: "Built end-to-end.", line2: "Grounded in outcomes." },
  monogram: { a: "A", d: "D" },
  card: {
    metaLabel: "Profile · 001",
    status: "Live",
    caption: "Based in Dublin, Ireland / Open to consulting · UCD Smurfit · 2025",
  },
  // Markdown-ish: *…* marks italic emphasis, rendered by the component.
  bio: [
    "I'm a forward-deployed engineer working at the intersection of AI systems, business strategy, and technology consulting. My background is unusual by design — I came into AI through business and operations, not purely engineering. That shaped how I think: before models, before architecture, before tooling, the real question is always — *what decision are we improving?*",
    "Today I build AI-first systems involving LLM architectures, RAG pipelines, semantic search, agentic workflows, and AI product strategy — leading end-to-end development from concept to production while balancing model performance, latency, cost, governance, and real-world usability. At IndiGo, one of the world's largest airlines, I worked across operational analytics and business technology for a 300+ aircraft fleet, leading ML-driven optimisation that delivered measurable savings.",
    "I'm currently pursuing an MSc in Business Analytics at UCD Michael Smurfit, with formal AI & ML training from IIT Kanpur. I write on strategy, analytics, and AI, host two podcasts, mentor early-career professionals, and am open to consulting in Ireland and globally.",
  ],
  stack: [
    { label: "AI & LLMs", items: ["Claude", "RAG", "LangChain", "Pydantic AI", "Agentic workflows", "Semantic search"] },
    { label: "Data & ML", items: ["Python", "SQL", "scikit-learn", "TensorFlow", "PyTorch", "Pandas"] },
    { label: "Platform & cloud", items: ["Supabase", "GCP", "Azure", "OAuth 2.0", "Power BI", "Tableau"] },
    { label: "Strategy", items: ["KPI design", "Decision intelligence", "Digital transformation", "AI evaluation"] },
  ],
  stats: [
    { value: 300, suffix: "+", label: "Fleet supported" },
    { value: 90, suffix: "%", label: "LLM cost cut" },
    { value: 17, suffix: "", label: "Articles" },
    { value: 2, suffix: "", label: "Podcasts", pad: true },
  ],
  skills: [
    { label: "AI Product Strategy", value: 85 },
    { label: "Digital Transformation & Consulting", value: 85 },
    { label: "Analytics & BI", value: 80 },
    { label: "Machine Learning & LLMs", value: 75 },
    { label: "Optimisation & Forecasting", value: 70 },
  ],
} as const;

export type Testimonial = { name: string; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "David Williams",
    quote:
      "Advait has a strong sense of understanding data and the requirements that come with it, and knows the approaches that are effective for solving the problem at hand.",
  },
  {
    name: "Jessica Joseph",
    quote:
      "Advait was hired on contract to handle my business data, present insights, and recommend solutions to help me expand in the market. His work is phenomenal, and his subject knowledge reflects a deep understanding of data and the insights that solve real problems.",
  },
];

export type Article = { title: string; category: string; date: string; href: string };

export const WRITING_INTRO =
  "Long-form writing on AI, analytics, finance, and strategy.";

export const ARTICLES: Article[] = [
  {
    title: "Automate Finance with AI: Introducing Finance-AutoML",
    category: "AI & Finance",
    date: "Jun 30, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/automate-finance-with-ai-introducing-finance-automl-an-automl-framework-tailored-for-financial-6b4ae964b228",
  },
  {
    title: "Future of Business Analytics in this Evolution of AI",
    category: "Analytics",
    date: "Jun 14, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/future-of-business-analytics-in-this-evolution-of-ai-ed4c9e016479",
  },
  {
    title: "Streamlining Financial Feature Engineering with FinFeatures",
    category: "Finance",
    date: "May 31, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/streamlining-financial-feature-engineering-with-finfeatures-9c3683537737",
  },
  {
    title: "Pydantic AI Explained: Simplifying LLM Workflows",
    category: "AI & LLMs",
    date: "May 27, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/pydantic-ai-explained-simplifying-llm-workflows-with-real-world-examples-afb2be7cf703",
  },
  {
    title: "Creating LLMs for Financial Analysis",
    category: "AI & Finance",
    date: "Apr 13, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/creating-large-language-models-for-financial-analysis-a-game-changer-for-modern-finance-fdbf54ad5baa",
  },
  {
    title: "The Analytics Illusion: When Averages Mislead You",
    category: "Analytics",
    date: "Mar 14, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/the-analytics-illusion-when-averages-mislead-you-c9f07ada5294",
  },
  {
    title: "When Data Lies: Uncovering Hidden Bias in Analytics",
    category: "Analytics",
    date: "Mar 14, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/when-data-lies-uncovering-hidden-bias-in-analytics-92ed16312f36",
  },
  {
    title: "How AI is Reshaping Business Strategy",
    category: "Strategy",
    date: "Feb 9, 2025",
    href: "https://medium.com/@advaitdharmadhikari7/how-ai-is-reshaping-business-strategy-a-deep-dive-into-transformation-4045f5860480",
  },
];

export type Podcast = {
  index: string;
  title: string;
  tagline: string;
  embedUrl: string;
  openUrl: string;
  episodes: string[];
};

export const PODCAST_INTRO =
  "I host two shows — one decoding how business and technology converge, one with bite-sized motivation for busy lives.";

export const PODCASTS: Podcast[] = [
  {
    index: "01",
    title: "The Business Technologist",
    tagline: "Decoding digital transformation, AI & innovation for real enterprise value.",
    embedUrl: "https://open.spotify.com/embed/show/2nMlpUNSqh9ZiI1vsg5B1g?theme=0",
    openUrl: LINKS.spotifyBusinessTechnologist,
    episodes: [
      "From Data to Decisions — The Rise of Decision Intelligence",
      "The Death of SaaS — And the Rise of AI-Native Enterprises",
      "Hyperautomation: When Automation Becomes a Strategy",
      "Agentic AI: Firing Your Chatbot, Hiring a Digital Worker",
    ],
  },
  {
    index: "02",
    title: "5 Minute Boosters",
    tagline: "Bite-sized motivation & personal growth that fits your routine.",
    embedUrl: "https://open.spotify.com/embed/show/32D27hJiy5sEZ7RnULzcBS?theme=0",
    openUrl: LINKS.spotifyBoosters,
    episodes: [
      "Your Mind Is Lying to You",
      "Your Future Self Is Watching",
      "Success Isn't Loud — It's Consistent",
      "Stop Apologizing for Who You Are",
    ],
  },
];

export const CONTACT = {
  headline: { line1: "Let's build", line2: "something intelligent." },
  projectTypes: [
    "AI Systems",
    "LLM Architecture",
    "AI Product Strategy",
    "Analytics & BI",
    "Digital Transformation",
    "Consulting",
  ],
  successMessage:
    "Thanks for reaching out. Your message has been sent — I'll get back to you soon.",
  channels: [
    { label: "LinkedIn", value: "in/advaitdharmadhikari2710", href: LINKEDIN_URL },
    { label: "GitHub", value: "@advait27", href: LINKS.github },
    { label: "Medium", value: "@advaitdharmadhikari7", href: LINKS.medium },
    { label: "Instagram", value: "@mr.maverick27", href: LINKS.instagram },
    { label: "Phone", value: "+353 89 204 0580", href: "tel:+353892040580" },
  ],
  currently:
    "MSc Business Analytics @ UCD Smurfit | Founding Engineer @ Frensei | Status Open to consulting · Ireland & globally",
} as const;

export const FOOTER = {
  marquee:
    "Open to consulting · Let's build something intelligent · AI strategy & forward-deployed engineering · ",
  wordmark: "Advait Dharmadhikari",
  copyright: "© 2026 Advait Dharmadhikari · All rights reserved",
  status: "Built with care",
} as const;
