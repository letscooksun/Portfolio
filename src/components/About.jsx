import { m } from 'framer-motion';
import { about } from '../data/portfolioData';
import { fadeUp, inViewOnce, stagger } from '../utils/motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading id="about-title" index="01" label="About" title="A little about me." />

        <div className="about__grid">
          <Reveal className="about__story">
            <p className="about__lead">{about.lead}</p>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="about__text">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal as="aside" className="about__facts" delay={0.1} aria-label="Quick facts">
            <p className="about__facts-title">
              <span className="status-dot" aria-hidden="true" />
              At a glance
            </p>
            <dl>
              {about.facts.map((fact) => (
                <div className="about__fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <m.ul
          className="about__values"
          aria-label="Core strengths"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {about.strengths.map((value, i) => (
            <m.li className="about__value" key={value.title} variants={fadeUp}>
              <span className="about__value-index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="about__value-title">{value.title}</h3>
              <p className="about__value-text">{value.text}</p>
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}
