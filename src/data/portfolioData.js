/*
 * All portfolio content lives here, separate from presentation.
 * Anything set to `null` renders as an honest "coming soon" placeholder —
 * replace it with a real value and the UI updates automatically.
 */
import {
  Atom,
  Braces,
  CodeXml,
  Cpu,
  FileCode2,
  FileText,
  GitBranch,
  Mail,
  Palette,
  Route,
  SquareTerminal,
  Wind,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/brandIcons';
import skillbridgeShot from '../assets/projects/skillbridge.webp';

export const profile = {
  name: 'Shuvayan Sarkar',
  firstName: 'Shuvayan',
  lastName: 'Sarkar',
  initials: 'SS',
  role: 'Student developer',
  greeting: "HELLO, I'M",
  headline: {
    lead: 'Building thoughtful digital experiences through',
    emphasis: 'frontend development.',
  },
  summary:
    "I'm a B.Tech student passionate about frontend engineering, modern web technologies and creating practical digital experiences. Currently exploring React and working towards becoming a full-stack developer.",
  shortBio:
    'First-year B.Tech ECE student focused on frontend development, React and Next.js, working towards full-stack engineering.',
  status: 'Open to internships',
  currentlyLearning: 'React',
  /*
   * Profile photo (optional). Put an image in src/assets and import it, e.g.
   *   import avatar from '../assets/avatar.webp';
   *   avatar: { src: avatar, alt: 'Portrait of Shuvayan Sarkar' },
   * Leave as null to show the monogram fallback.
   */
  avatar: null,
  /* Resume PDF served from /public. Set to null to show a disabled placeholder. */
  resumeUrl: '/Shuvayan_Sarkar_Resume.pdf',
};

export const socials = {
  email: 'shuvayansarkar357@gmail.com',
  github: 'https://github.com/letscooksun',
  githubHandle: 'letscooksun',
  linkedin: 'https://www.linkedin.com/in/shuvayan-sarkar-4a1778292/',
  linkedinHandle: 'in/shuvayan-sarkar',
};

/* One list drives every social link on the page (hero, menu, contact, footer). */
export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    handle: `@${socials.githubHandle}`,
    href: socials.github,
    icon: GithubIcon,
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: socials.linkedinHandle,
    href: socials.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    handle: socials.email,
    href: `mailto:${socials.email}`,
    icon: Mail,
    external: false,
  },
];

/* Resume as a link entry (contact list, footer). Opens the PDF in a new tab. */
export const resumeLink = profile.resumeUrl
  ? {
      id: 'resume',
      label: 'Resume',
      handle: 'View PDF',
      href: profile.resumeUrl,
      icon: FileText,
      external: true,
    }
  : null;

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const about = {
  lead: "I'm Shuvayan, a first-year B.Tech student in Electronics and Communication Engineering at JIS College of Engineering, graduating in 2029. My degree keeps me close to circuits and signals, but the part of technology I keep coming back to is the web.",
  paragraphs: [
    'What I enjoy about frontend development is how direct it is. You write a few lines, refresh the page, and something you imagined is suddenly on the screen. I like the details that make an interface feel right: clear layout, considered spacing, and the way a page responds when you use it.',
    "Right now I'm going deeper into React and Next.js. Building SkillBridge with the Next.js App Router has also been my first real look at the server side, through route handlers. I learn best by building, so I try to turn what I study into practical projects rather than leaving it as theory.",
    "Over time I want to grow into a full-stack developer: someone who can take an idea from the interface all the way through to the server and data behind it. I'm currently looking for a full-stack developer internship where I can contribute to real projects and keep learning.",
  ],
  facts: [
    { label: 'Degree', value: 'B.Tech, Electronics & Communication Engineering' },
    { label: 'College', value: 'JIS College of Engineering' },
    { label: 'Graduating', value: '2029 (expected)' },
    { label: 'CGPA', value: '8.01' },
    { label: 'Current focus', value: 'Frontend, React, Next.js' },
    { label: 'Looking for', value: 'Full-stack developer internship' },
  ],
  /* Core strengths, as listed on the resume. */
  strengths: [
    { title: 'Problem-solving mindset', text: 'Breaking a problem into small steps and working through them one at a time.' },
    { title: 'Willingness to learn', text: 'Comfortable starting from zero and staying with the docs until it clicks.' },
    { title: 'Collaborative project work', text: 'Building with others, sharing ideas and taking feedback on board.' },
    { title: 'Continuous practice', text: 'Steady, regular practice rather than occasional bursts of effort.' },
  ],
};

/*
 * No proficiency scores on purpose. `learning: true` marks what I'm actively studying.
 * Icons are Lucide symbols chosen to represent each tool, not official logos.
 */
export const skillGroups = [
  {
    id: 'frontend',
    title: 'Frontend',
    caption: 'Building for the browser',
    items: [
      { name: 'HTML5', note: 'Semantic markup', icon: FileCode2 },
      { name: 'CSS3', note: 'Layout & styling', icon: Palette },
      { name: 'JavaScript', note: 'ES6+ and the DOM', icon: Braces },
      { name: 'React', note: 'Components & hooks', icon: Atom, learning: true },
      { name: 'Next.js', note: 'App Router & route handlers', icon: Route },
      { name: 'Tailwind CSS', note: 'Utility-first CSS', icon: Wind },
    ],
  },
  {
    id: 'programming',
    title: 'Programming',
    caption: 'Fundamentals & problem solving',
    items: [
      { name: 'C++', note: 'Programming fundamentals', icon: Cpu },
      { name: 'Python', note: 'The basics', icon: SquareTerminal },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    caption: 'Everyday workflow',
    items: [
      { name: 'Git', note: 'Version control', icon: GitBranch },
      { name: 'GitHub', note: 'Code hosting', icon: GithubIcon },
      { name: 'VS Code', note: 'Code editor', icon: CodeXml },
    ],
  },
];

/*
 * Projects
 * - image: { src, alt, width, height } — import screenshots from src/assets.
 * - links: href: null renders a disabled "soon" state. Add real URLs when available.
 * - stack: the technologies actually used. An empty array shows a neutral note.
 */
export const projects = [
  {
    id: 'skillbridge',
    index: '01',
    name: 'SkillBridge',
    category: 'Platform concept',
    status: 'In development',
    description:
      'A platform concept that helps students and early-career professionals discover recruiters, mentors and professional communities based on their skills, interests and goals.',
    highlights: ['Recruiters, mentors & communities', 'Skills, interests & goals', 'Next.js App Router & route handlers'],
    stack: ['Next.js', 'JavaScript', 'Tailwind CSS'],
    image: {
      src: skillbridgeShot,
      alt: 'SkillBridge landing page with the headline "Your Network, Your Opportunity" over a mountain landscape.',
      width: 1440,
      height: 900,
    },
    placeholder: 'platform',
    featured: true,
    links: [
      { kind: 'github', label: 'Source code', href: null },
      { kind: 'live', label: 'Live project', href: 'https://skillsbridge-alpha.vercel.app/' },
    ],
  },
  {
    id: 'portfolio',
    index: '02',
    name: 'Personal Portfolio',
    category: 'Personal website',
    status: "You're looking at it",
    description:
      'My personal developer portfolio showcasing my skills, learning journey and development projects, with a serverless contact form backend.',
    highlights: [],
    stack: ['React', 'Vite', 'Framer Motion', 'CSS', 'Vercel Functions'],
    image: null,
    placeholder: 'portfolio',
    links: [
      { kind: 'github', label: 'Source code', href: null },
      { kind: 'live', label: 'Live site', href: null },
    ],
  },
  {
    id: 'next',
    index: '03',
    name: 'Next project',
    category: 'Reserved slot',
    status: 'Coming up',
    description:
      "This space is saved for whatever I build next. New work will appear here as it's ready. Until then, GitHub is the best place to follow along.",
    highlights: [],
    stack: [],
    image: null,
    placeholder: 'future',
    isReserved: true,
    links: [{ kind: 'github', label: 'Follow on GitHub', href: socials.github }],
  },
];

export const journey = [
  {
    id: 'btech',
    marker: 'Education',
    period: 'Expected 2029',
    title: 'B.Tech, Electronics and Communication Engineering',
    org: 'JIS College of Engineering',
    description:
      'Pursuing my undergraduate degree and building an engineering foundation, while learning web development alongside my studies.',
    points: ['First year', 'CGPA 8.01'],
    state: 'current',
  },
  {
    id: 'frontend',
    marker: 'Now',
    period: 'Currently',
    title: 'Learning frontend development',
    description:
      'Building a solid base in the web platform and turning what I learn into working projects.',
    points: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Practical project building'],
    state: 'current',
  },
  {
    id: 'backend',
    marker: 'Building',
    period: 'In progress',
    title: 'Backend fundamentals',
    description:
      'Started on the server side through Next.js route handlers while building SkillBridge: APIs, data, and how the pieces of an application talk to each other.',
    state: 'current',
  },
  {
    id: 'internship',
    marker: 'Next',
    period: 'Seeking',
    title: 'Full-stack developer internship',
    description:
      'Looking for an internship where I can contribute to real projects, learn from experienced developers and strengthen my practical development skills.',
    state: 'future',
  },
  {
    id: 'fullstack',
    marker: 'Goal',
    period: 'Long term',
    title: 'Full-stack engineering',
    description:
      'Becoming a developer who can design, build and ship complete products, from the interface to everything behind it.',
    state: 'future',
  },
];
