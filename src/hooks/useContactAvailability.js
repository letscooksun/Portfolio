import { useEffect, useState } from 'react';

/*
 * Asks the API whether the contact form can actually deliver email.
 * Returns false until confirmed, so the form only appears when it works.
 * A static host without /api (404 or HTML fallback) also resolves to false.
 */
export default function useContactAvailability() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/contact', { headers: { Accept: 'application/json' }, signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setAvailable(data?.configured === true))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return available;
}
