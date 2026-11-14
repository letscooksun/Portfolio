import Reveal from './Reveal';

export default function SectionHeading({ id, index, label, title, intro }) {
  return (
    <Reveal className="section-heading">
      <p className="section-heading__label">
        <span className="section-heading__index">{index}</span>
        <span aria-hidden="true">/</span>
        <span>{label}</span>
        <span className="section-heading__rule" aria-hidden="true" />
      </p>
      <div className="section-heading__row">
        <h2 id={id} className="section-heading__title">
          {title}
        </h2>
        {intro && <p className="section-heading__intro">{intro}</p>}
      </div>
    </Reveal>
  );
}
