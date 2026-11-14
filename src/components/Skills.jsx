import { m } from 'framer-motion';
import { skillGroups } from '../data/portfolioData';
import { fadeUp, inViewOnce, stagger } from '../utils/motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Skills() {
  return (
    <section id="skills" className="section section--alt" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          id="skills-title"
          index="02"
          label="Toolkit"
          title="Technologies I work with."
          intro="The languages and tools I use to learn, experiment and build. Items marked as learning are where most of my time is going right now."
        />

        <div className="skills">
          {skillGroups.map((group) => (
            <div className="skills__group" key={group.id}>
              <Reveal className="skills__heading">
                <h3 className="skills__title">{group.title}</h3>
                <p className="skills__caption">{group.caption}</p>
              </Reveal>

              <m.ul
                className="skills__list"
                variants={stagger(0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={inViewOnce}
              >
                {group.items.map(({ name, note, icon: Icon, learning }) => (
                  <m.li className="skill" key={name} variants={fadeUp}>
                    <span className="skill__icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="skill__text">
                      <span className="skill__name">{name}</span>
                      <span className="skill__note">{note}</span>
                    </span>
                    {learning && <span className="skill__badge">Learning</span>}
                  </m.li>
                ))}
              </m.ul>
            </div>
          ))}
        </div>

        <Reveal as="p" className="skills__footnote">
          No skill bars or percentages here. The projects below are a more honest measure.
        </Reveal>
      </div>
    </section>
  );
}
