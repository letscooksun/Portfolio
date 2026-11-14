import { m } from 'framer-motion';
import { projects } from '../data/portfolioData';
import { inViewOnce, stagger } from '../utils/motion';
import ProjectCard from './ProjectCard';
import SectionHeading from './SectionHeading';

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          index="03"
          label="Selected work"
          title="Things I've been building."
          intro="A small but growing collection. Each project is a chance to learn something new and turn it into something that works."
        />

        <m.div
          className="projects__grid"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </m.div>
      </div>
    </section>
  );
}
