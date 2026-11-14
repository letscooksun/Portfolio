import { m } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { resumeLink, socialLinks, socials } from '../data/portfolioData';
import useContactAvailability from '../hooks/useContactAvailability';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { fadeUp, inViewOnce, stagger } from '../utils/motion';
import { linkProps } from '../utils/links';
import ContactForm from './ContactForm';
import Reveal from './Reveal';

const CHANNELS = resumeLink ? [...socialLinks, resumeLink] : socialLinks;

/* Lets a long email wrap after the "@" instead of mid-word on narrow screens. */
function withBreakAfterAt(text) {
  const at = text.indexOf('@');
  if (at <= 0) return text;
  return (
    <>
      {text.slice(0, at + 1)}
      <wbr />
      {text.slice(at + 1)}
    </>
  );
}

function ContactChannels({ compact = false }) {
  return (
    <m.ul
      className={`contact__links${compact ? ' contact__links--compact' : ''}`}
      aria-label="Contact channels"
      variants={stagger(0.08, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      {CHANNELS.map(({ id, label, handle, href, icon: Icon, ...link }) => (
        <m.li key={id} variants={fadeUp}>
          <a className="contact-link" href={href} {...linkProps(link)}>
            <span className="contact-link__icon" aria-hidden="true">
              <Icon size={18} strokeWidth={1.6} />
            </span>
            <span className="contact-link__text">
              <span className="contact-link__label">{label}</span>
              <span className="contact-link__handle">{withBreakAfterAt(handle)}</span>
            </span>
            <ArrowUpRight className="contact-link__arrow" size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </m.li>
      ))}
    </m.ul>
  );
}

export default function Contact() {
  const formEnabled = useContactAvailability();
  const [copied, copy] = useCopyToClipboard();

  return (
    <section
      id="contact"
      className={`section contact${formEnabled ? ' contact--with-form' : ''}`}
      aria-labelledby="contact-title"
    >
      <div className="container contact__grid">
        <div className="contact__intro">
          <Reveal>
            <p className="section-heading__label">
              <span className="section-heading__index">05</span>
              <span aria-hidden="true">/</span>
              <span>Contact</span>
            </p>
            <h2 id="contact-title" className="contact__title">
              Have something in mind? <span>Let&apos;s connect.</span>
            </h2>
            <p className="contact__text">
              I&apos;m always interested in learning, collaborating and discussing interesting ideas around
              technology and development.
            </p>

            {!formEnabled && (
              <div className="contact__actions">
                <a className="btn btn--primary" href={`mailto:${socials.email}`}>
                  <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                  Send an email
                </a>
                <button type="button" className="btn btn--secondary" onClick={() => copy(socials.email)}>
                  {copied ? (
                    <Check size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Copy size={16} strokeWidth={1.75} aria-hidden="true" />
                  )}
                  {copied ? 'Copied' : 'Copy address'}
                </button>
                <span className="sr-only" aria-live="polite">
                  {copied ? 'Email address copied to clipboard' : ''}
                </span>
              </div>
            )}
          </Reveal>

          {formEnabled && <ContactChannels compact />}
        </div>

        {formEnabled ? <ContactForm /> : <ContactChannels />}
      </div>
    </section>
  );
}
