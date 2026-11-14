import { m } from 'framer-motion';
import { ArrowDown, ArrowRight, Download, FileText } from 'lucide-react';
import { profile, socialLinks } from '../data/portfolioData';
import { EASE_OUT, fadeIn, fadeUp, lineReveal, stagger } from '../utils/motion';
import { linkProps } from '../utils/links';

/* Rendered as a read-only "source file" — a quiet technical motif that is also real content. */
const CODE_LINES = [
  [['kw', 'const '], ['var', 'shuvayan'], ['punc', ' = {']],
  [['key', '  degree'], ['punc', ': '], ['str', '"B.Tech, ECE"'], ['punc', ',']],
  [['key', '  graduating'], ['punc', ': '], ['num', '2029'], ['punc', ',']],
  [['key', '  focus'], ['punc', ': ['], ['str', '"JavaScript"'], ['punc', ', '], ['str', '"React"'], ['punc', '],']],
  [['key', '  building'], ['punc', ': '], ['str', '"SkillBridge"'], ['punc', ',']],
  [['key', '  nextUp'], ['punc', ': '], ['str', '"full-stack"'], ['punc', ',']],
  [['key', '  openTo'], ['punc', ': '], ['str', '"internships"'], ['punc', ',']],
  [['punc', '};']],
];

function ProfilePanel() {
  const { avatar, initials, name, role } = profile;

  return (
    <div className="profile-panel">
      <div className="profile-panel__bar">
        <span className="profile-panel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="profile-panel__file">about-me.js</span>
        <span className="profile-panel__lang">JS</span>
      </div>

      <div className="profile-panel__identity">
        {avatar ? (
          <img
            className="profile-panel__avatar"
            src={avatar.src}
            alt={avatar.alt}
            width="56"
            height="56"
          />
        ) : (
          <span className="profile-panel__avatar profile-panel__avatar--fallback" aria-hidden="true">
            {initials}
          </span>
        )}
        <div>
          <p className="profile-panel__name">{name}</p>
          <p className="profile-panel__role">{role} · ECE ’29</p>
        </div>
      </div>

      <pre className="profile-panel__code" aria-label="Profile summary written as a JavaScript object">
        <code>
          {CODE_LINES.map((tokens, line) => (
            <span className="code-line" key={line}>
              <span className="code-line__no" aria-hidden="true">
                {line + 1}
              </span>
              <span>
                {tokens.map(([type, text], i) => (
                  <span key={i} className={`tok-${type}`}>
                    {text}
                  </span>
                ))}
                {line === CODE_LINES.length - 1 && <span className="code-cursor" aria-hidden="true" />}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function ResumeButton() {
  if (profile.resumeUrl) {
    return (
      <a className="btn btn--secondary" href={profile.resumeUrl} download="Shuvayan_Sarkar_Resume.pdf">
        <Download className="btn__download" size={16} strokeWidth={1.75} aria-hidden="true" />
        Download resume
      </a>
    );
  }

  return (
    <span className="btn btn--secondary is-disabled" title="Resume coming soon">
      <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
      Resume
      <span className="soon-chip">Soon</span>
    </span>
  );
}

export default function Hero() {
  const { greeting, firstName, lastName, headline, summary, currentlyLearning, status } = profile;

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true" />

      <div className="container hero__inner">
        <m.div
          className="hero__content"
          variants={stagger(0.07, 0.05)}
          initial="hidden"
          animate="visible"
        >
          <m.p className="hero__greeting" variants={fadeUp}>
            <span className="hero__greeting-rule" aria-hidden="true" />
            {greeting}
          </m.p>

          <h1 id="hero-title" className="hero__name">
            <span className="hero__name-line">
              <m.span variants={lineReveal}>{firstName}</m.span>
            </span>{' '}
            <span className="hero__name-line">
              <m.span variants={lineReveal}>
                {lastName}
                <span className="hero__name-dot" aria-hidden="true">
                  .
                </span>
              </m.span>
            </span>
          </h1>

          <m.p className="hero__headline" variants={fadeUp}>
            {headline.lead} <em>{headline.emphasis}</em>
          </m.p>

          <m.p className="hero__summary" variants={fadeUp}>
            {summary}
          </m.p>

          <m.div className="hero__actions" variants={fadeUp}>
            <a className="btn btn--primary" href="#projects">
              View my work
              <ArrowRight className="btn__arrow" size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <ResumeButton />
          </m.div>

          <m.ul className="hero__socials" variants={fadeUp} aria-label="Elsewhere">
            {socialLinks.map(({ id, label, href, icon: Icon, ...link }) => (
              <li key={id}>
                <a className="hero__social" href={href} {...linkProps(link)}>
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </m.ul>
        </m.div>

        <m.aside
          className="hero__panel"
          aria-label="Profile at a glance"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT }}
        >
          <ProfilePanel />
        </m.aside>
      </div>

      <m.div
        className="container hero__footer"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.6}
      >
        <div className="hero__footer-inner">
          <dl className="hero__meta">
            <div>
              <dt>Currently</dt>
              <dd>Learning {currentlyLearning}</dd>
            </div>
            <div>
              <dt>Studying</dt>
              <dd>B.Tech, ECE · 2029</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className="status-dot" aria-hidden="true" />
                {status}
              </dd>
            </div>
          </dl>

          <a className="scroll-cue" href="#about">
            <span>Scroll</span>
            <span className="scroll-cue__track" aria-hidden="true">
              <ArrowDown size={14} strokeWidth={1.75} />
            </span>
          </a>
        </div>
      </m.div>
    </section>
  );
}
