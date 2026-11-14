import { useCallback, useEffect, useRef, useState } from 'react';

/* Copies text and exposes a `copied` flag that resets after `resetMs`. */
export default function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        // Clipboard can be unavailable (insecure context, denied permission).
        return false;
      }
    },
    [resetMs],
  );

  return [copied, copy];
}
