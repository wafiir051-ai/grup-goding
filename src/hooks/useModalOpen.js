import { useEffect, useState } from 'react';

// true selama modal WhatsApp atau modal checkout terbuka. Efek yang memakai clip-path
// mematikan dirinya saat itu, karena clip-path pada leluhur ikut memotong modal yang fixed.
const MODAL_SELECTOR = '.fixed.inset-0.items-center.justify-center';
const listeners = new Set();
let observer = null;
let open = false;

function check() {
  const next = !!document.querySelector(MODAL_SELECTOR);
  if (next === open) return;
  open = next;
  listeners.forEach((fn) => fn(open));
}

export default function useModalOpen() {
  const [state, setState] = useState(open);
  useEffect(() => {
    listeners.add(setState);
    if (!observer) {
      observer = new MutationObserver(check);
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return () => {
      listeners.delete(setState);
      if (!listeners.size && observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, []);
  return state;
}
