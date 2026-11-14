import { m } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { fadeUp } from '../utils/motion';
import { externalLinkProps } from '../utils/links';
import { GithubIcon } from './brandIcons';

const LINK_ICONS = { github: GithubIcon, live: ArrowUpRight };

/*
 * Neutral, clearly-labelled stand-in shown until a real screenshot is added.
 * Deliberately abstract so it can't be mistaken for an actual product UI.
 */
function MediaPlaceholder({ variant, name }) {
  if (variant === 'future') {
    return (
      <div className="placeholder placeholder--future">
        <span className="placeholder__plus" aria-hidden="true">
          <Plus size={22} strokeWidth={1.5} />
        </span>
        <span className="placeholder__note">Slot reserved</span>
      </div>
    );
  }

  return (
    <div className={`placeholder placeholder--${variant}`} role="img" aria-label={`${name} preview placeholder. Screenshot coming soon.`}>
      <div className="placeholder__window" aria-hidden="true">
        <div className="placeholder__chrome">
          <i />
          <i />
          <i />
          <span className="placeholder__url">{name.toLowerCase().replace(/\s+/g, '-')}</span>
        </div>
        <div className="placeholder__body">
          {variant === 'platform' ? (
            <>
              <div className="sk-sidebar">
                <span className="sk sk--w60" />
                <span className="sk sk--w80" />
                <span className="sk sk--w70" />
                <span className="sk sk--w50" />
              </div>
              <div className="sk-main">
                <span className="sk sk--bar" />
                <div className="sk-cards">
                  {[0, 1, 2].map((n) => (
                    <div className="sk-card" key={n}>
                      <span className="sk-avatar" />
                      <span className="sk sk--w80" />
                      <span className="sk sk--w50" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="sk-page">
              <span className="sk sk--w30" />
              <span className="sk sk--display" />
              <span className="sk sk--display sk--w60" />
              <span className="sk sk--w70" />
              <span className="sk sk--w50" />
              <div className="sk-buttons">
                <span className="sk sk--pill sk--solid" />
                <span className="sk sk--pill" />
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="placeholder__note">Screenshot coming soon</span>
    </div>
  );
}

function ProjectLink({ kind, label, href }) {
  const Icon = LINK_ICONS[kind] ?? ArrowUpRight;

  if (!href) {
    return (
      <span className="project-link is-disabled" title={`${label} not available yet`}>
        <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
        {label}
        <span className="soon-chip">Soon</span>
      </span>
    );
  }

  return (
    <a className="project-link" href={href} {...externalLinkProps}>
      <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
      {label}
      <ArrowUpRight className="project-link__arrow" size={14} strokeWidth={2} aria-hidden="true" />
    </a>
  );
}

export default function ProjectCard({ project }) {
  const { index, name, category, status, description, highlights, stack, image, placeholder, links, featured, isReserved } =
    project;

  const classes = ['project-card', featured && 'project-card--featured', isReserved && 'project-card--reserved']
    .filter(Boolean)
    .join(' ');

  return (
    <m.article className={classes} variants={fadeUp} aria-labelledby={`project-${project.id}`}>
      <div className="project-card__media">
        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <MediaPlaceholder variant={placeholder} name={name} />
        )}
      </div>

      <div className="project-card__body">
        <p className="project-card__meta">
          <span className="project-card__index">{index}</span>
          <span>{category}</span>
          {status && <span className="project-card__status">{status}</span>}
        </p>

        <h3 id={`project-${project.id}`} className="project-card__title">
          {name}
        </h3>
        <p className="project-card__description">{description}</p>

        {highlights.length > 0 && (
          <ul className="project-card__highlights" aria-label="Focus areas">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {!isReserved && (
          <div className="project-card__stack">
            {stack.length > 0 ? (
              <ul className="tag-list" aria-label="Built with">
                {stack.map((tech) => (
                  <li className="tag" key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="project-card__pending">Tech stack details coming soon</p>
            )}
          </div>
        )}

        <div className="project-card__links">
          {links.map((link) => (
            <ProjectLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </m.article>
  );
}
