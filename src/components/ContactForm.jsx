import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, Check, CircleAlert, CircleCheck, Copy, LoaderCircle } from 'lucide-react';
import { socials } from '../data/portfolioData';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { CONTACT_LIMITS, normalizeContact, validateContact } from '../utils/contactValidation';
import { EASE_OUT, fadeUp, inViewOnce } from '../utils/motion';

const EMPTY = { name: '', email: '', message: '', website: '' };
const FIELD_ORDER = ['name', 'email', 'message'];
const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

async function submitContact(payload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  const result = await response.json().catch(() => ({}));
  return { ok: response.ok && result.ok === true, status: response.status, ...result };
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [notice, setNotice] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const isSubmitting = status === 'submitting';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors(({ [name]: _cleared, ...rest }) => rest);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const contact = normalizeContact(values);
    const found = validateContact(contact);

    const focusFirstError = (fieldErrors) => {
      const first = FIELD_ORDER.find((field) => fieldErrors[field]);
      if (first) form.elements[first]?.focus();
    };

    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError(found);
      return;
    }

    setStatus('submitting');
    setNotice('');

    try {
      const result = await submitContact({ ...contact, website: values.website });

      if (result.ok) {
        setStatus('success');
        setValues(EMPTY);
        setErrors({});
        return;
      }

      if (result.status === 400 && result.errors) {
        setErrors(result.errors);
        setStatus('idle');
        focusFirstError(result.errors);
        return;
      }

      setStatus('error');
      setNotice(result.error || "Your message couldn't be sent right now.");
    } catch {
      setStatus('error');
      setNotice('Network problem — check your connection and try again.');
    }
  }

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    disabled: isSubmitting,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });

  const fieldError = (name) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="field__error">
        {errors[name]}
      </p>
    );

  return (
    <m.div
      className="contact-form"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      custom={0.1}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <m.div key="success" className="contact-form__success" role="status" {...swap}>
            <span className="contact-form__success-icon" aria-hidden="true">
              <CircleCheck size={22} strokeWidth={1.75} />
            </span>
            <h3 className="contact-form__title">Message sent.</h3>
            <p className="contact-form__lead">
              Thanks for reaching out. I&apos;ll reply to the email address you shared as soon as I can.
            </p>
            <button type="button" className="btn btn--secondary" onClick={() => setStatus('idle')}>
              Send another message
            </button>
          </m.div>
        ) : (
          <m.form key="form" noValidate onSubmit={handleSubmit} aria-labelledby="contact-form-title" {...swap}>
            <div className="contact-form__head">
              <h3 id="contact-form-title" className="contact-form__title">
                Send a message
              </h3>
              <p className="contact-form__lead">It goes straight to my inbox.</p>
            </div>

            <div className="contact-form__row">
              <div className="field">
                <label className="field__label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  className="field__control"
                  type="text"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name.max}
                  placeholder="Your name"
                  {...fieldProps('name')}
                />
                {fieldError('name')}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  className="field__control"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email.max}
                  placeholder="you@example.com"
                  {...fieldProps('email')}
                />
                {fieldError('email')}
              </div>
            </div>

            <div className="field">
              <div className="field__label-row">
                <label className="field__label" htmlFor="contact-message">
                  Message
                </label>
                <span className="field__count" aria-hidden="true">
                  {values.message.length}/{CONTACT_LIMITS.message.max}
                </span>
              </div>
              <textarea
                className="field__control field__control--textarea"
                rows={6}
                maxLength={CONTACT_LIMITS.message.max}
                placeholder="What would you like to talk about?"
                {...fieldProps('message')}
              />
              {fieldError('message')}
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div className="field--trap" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={handleChange}
              />
            </div>

            {status === 'error' && (
              <p className="contact-form__notice" role="alert">
                <CircleAlert size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>
                  {notice}{' '}
                  <a href={`mailto:${socials.email}`}>Email me directly</a>.
                </span>
              </p>
            )}

            <div className="contact-form__footer">
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="spin" size={16} strokeWidth={2} aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight className="btn__arrow" size={16} strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="contact-form__alt">
                or email{' '}
                <a className="contact-form__email" href={`mailto:${socials.email}`}>
                  {socials.email}
                </a>
                <button
                  type="button"
                  className="contact-form__copy"
                  onClick={() => copy(socials.email)}
                  aria-label={copied ? 'Email address copied' : 'Copy email address'}
                  title={copied ? 'Copied' : 'Copy email address'}
                >
                  {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.75} />}
                </button>
              </p>
            </div>
          </m.form>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {isSubmitting ? 'Sending your message' : ''}
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </m.div>
  );
}
