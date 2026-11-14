/*
 * Contact form rules shared by the browser (instant feedback) and the API
 * (the real gatekeeper). Pure JavaScript, no DOM or Node APIs, so both can import it.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Trims input and collapses whitespace in the name (which also strips line breaks). */
export function normalizeContact(input = {}) {
  return {
    name: String(input.name ?? '').trim().replace(/\s+/g, ' '),
    email: String(input.email ?? '').trim(),
    message: String(input.message ?? '').trim(),
  };
}

/* Returns an object of field → message. Empty object means valid. */
export function validateContact({ name, email, message }) {
  const errors = {};
  const { name: n, email: e, message: m } = CONTACT_LIMITS;

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < n.min) errors.name = 'Your name looks a little short.';
  else if (name.length > n.max) errors.name = `Please keep your name under ${n.max} characters.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > e.max || !EMAIL_PATTERN.test(email)) errors.email = "That email address doesn't look right.";

  if (!message) errors.message = 'Please write a message.';
  else if (message.length < m.min) errors.message = `A little more detail, please (at least ${m.min} characters).`;
  else if (message.length > m.max) errors.message = `Please keep it under ${m.max} characters.`;

  return errors;
}
