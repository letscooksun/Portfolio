/*
 * Contact API — deployed as a Vercel Serverless Function at /api/contact.
 * In local development the same file is served by the small plugin in vite.config.js.
 *
 *   GET  /api/contact  → { configured: boolean }   lets the UI show the form only when it can deliver
 *   POST /api/contact  → validates, rate-limits and emails the message via Resend
 *
 * Environment variables (see .env.example):
 *   RESEND_API_KEY      required to send
 *   CONTACT_TO_EMAIL    inbox that receives messages
 *   CONTACT_FROM_EMAIL  sender; must be a Resend-verified domain, or onboarding@resend.dev
 */
import { normalizeContact, validateContact } from '../src/utils/contactValidation.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_TO = 'shuvayansarkar357@gmail.com';
const DEFAULT_FROM = 'Portfolio Contact <onboarding@resend.dev>';
const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT = { windowMs: 15 * 60 * 1000, max: 5 };

/*
 * Best-effort, per-instance rate limiting. Serverless instances don't share memory,
 * so this slows down casual abuse rather than guaranteeing a global limit.
 */
const recentRequests = new Map();

function sendJson(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(payload));
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return (typeof forwarded === 'string' && forwarded.split(',')[0].trim()) || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
  const limited = recent.length >= RATE_LIMIT.max;
  if (!limited) recent.push(now);
  recentRequests.set(ip, recent);

  if (recentRequests.size > 500) {
    for (const [key, times] of recentRequests) {
      if (times.every((time) => now - time >= RATE_LIMIT.windowMs)) recentRequests.delete(key);
    }
  }
  return limited;
}

/* Rejects cross-site form posts. Same-origin requests from the portfolio pass. */
function isForeignOrigin(req) {
  const { origin } = req.headers;
  if (!origin) return false;
  try {
    return new URL(origin).host !== (req.headers['x-forwarded-host'] ?? req.headers.host);
  } catch {
    return true;
  }
}

/* Vercel pre-parses JSON into req.body; plain Node (local dev) needs the stream read. */
async function readJsonBody(req) {
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) throw Object.assign(new Error('Body too large'), { status: 413 });
  }
  return raw ? JSON.parse(raw) : {};
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function buildEmail({ name, email, message }) {
  return {
    subject: `Portfolio message from ${name}`,
    text: `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\n\n${message}\n`,
    html: `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#111;max-width:560px">
  <p style="margin:0 0 16px;color:#666;font-size:13px">New message from your portfolio</p>
  <p style="margin:0"><strong>${escapeHtml(name)}</strong></p>
  <p style="margin:0 0 16px"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
</div>`,
  };
}

async function deliver(contact) {
  const { subject, text, html } = buildEmail(contact);
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: contact.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

export default async function handler(req, res) {
  const configured = Boolean(process.env.RESEND_API_KEY);

  if (req.method === 'GET') {
    return sendJson(res, 200, { configured });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'GET, POST' });
  }

  if (isForeignOrigin(req)) {
    return sendJson(res, 403, { ok: false, error: 'Forbidden.' });
  }

  if (!String(req.headers['content-type'] ?? '').includes('application/json')) {
    return sendJson(res, 415, { ok: false, error: 'Expected a JSON request.' });
  }

  if (Number(req.headers['content-length'] ?? 0) > MAX_BODY_BYTES) {
    return sendJson(res, 413, { ok: false, error: 'Message is too large.' });
  }

  if (!configured) {
    return sendJson(res, 503, { ok: false, error: "The contact form isn't available right now." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    const status = error.status === 413 ? 413 : 400;
    return sendJson(res, status, { ok: false, error: status === 413 ? 'Message is too large.' : 'Invalid request.' });
  }

  // Honeypot: real visitors never see or fill the "website" field. Bots get a quiet success.
  if (body?.website) {
    return sendJson(res, 200, { ok: true });
  }

  const contact = normalizeContact(body);
  const errors = validateContact(contact);
  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, { ok: false, error: 'Please check the highlighted fields.', errors });
  }

  if (isRateLimited(clientIp(req))) {
    return sendJson(
      res,
      429,
      { ok: false, error: 'Too many messages in a short time. Please try again later.' },
      { 'Retry-After': String(RATE_LIMIT.windowMs / 1000) },
    );
  }

  try {
    await deliver(contact);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('[contact] delivery failed:', error.message);
    return sendJson(res, 502, { ok: false, error: "Your message couldn't be sent right now." });
  }
}
