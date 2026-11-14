import { m } from 'framer-motion';
import { journey } from '../data/portfolioData';
import { fadeUp, inViewOnce, stagger } from '../utils/motion';
import SectionHeading from './SectionHeading';

export default function Journey() {
  return (
    <section id="experience" className="section section--alt" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeading
          id="journey-title"
          index="04"
          label="Journey"
          title="My journey so far."
          intro="No job titles to list yet. This is where I am, what I'm learning, and where I'm heading."
        />

        <m.ol
          className="timeline"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {journey.map((step) => (
            <m.li key={step.id} className={`timeline__item timeline__item--${step.state}`} variants={fadeUp}>
              <div className="timeline__marker">
                <span className="timeline__label">{step.marker}</span>
                <span className="timeline__period">{step.period}</span>
              </div>

              <div className="timeline__rail" aria-hidden="true">
                <span className="timeline__node" />
              </div>

              <div className="timeline__card">
                <h3 className="timeline__title">{step.title}</h3>
                {step.org && <p className="timeline__org">{step.org}</p>}
                <p className="timeline__text">{step.description}</p>
                {step.points && (
                  <ul className="tag-list timeline__points" aria-label="Details">
                    {step.points.map((point) => (
                      <li className="tag" key={point}>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  );
}
