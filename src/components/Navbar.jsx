import { useEffect, useState } from 'react';
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion';
import { navLinks, profile, socialLinks } from '../data/portfolioData';
import useActiveSection from '../hooks/useActiveSection';
import { fadeUp, stagger } from '../utils/motion';
import { linkProps } from '../utils/links';

const SECTION_IDS = ['top', ...navLinks.map((link) => link.id)];
const DESKTOP_QUERY = '(min-width: 861px)';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setIsScrolled(y > 12));

  // While the mobile menu is open: close on Escape, or when the viewport grows to desktop.
  useEffect(() => {
    if (!isOpen) return undefined;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onKeyDown = (event) => event.key === 'Escape' && setIsOpen(false);
    const onBreakpoint = (event) => event.matches && setIsOpen(false);

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`nav${isScrolled || isOpen ? ' nav--solid' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="wordmark" onClick={closeMenu}>
          <span className="wordmark__mark" aria-hidden="true">
            {profile.initials}
          </span>
          <span className="wordmark__name">{profile.name}</span>
        </a>

        <nav className="nav__desktop" aria-label="Primary">
          <ul className="nav__links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`nav__link${activeId === link.id ? ' is-active' : ''}`}
                  aria-current={activeId === link.id ? 'true' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="nav__status">
          <span className="status-dot" aria-hidden="true" />
          {profile.status}
        </p>

        <button
          type="button"
          className={`nav__toggle${isOpen ? ' is-open' : ''}`}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="nav__toggle-line" />
          <span className="nav__toggle-line" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <m.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <nav aria-label="Mobile">
              <m.ul
                className="mobile-menu__links"
                variants={stagger(0.05, 0.05)}
                initial="hidden"
                animate="visible"
              >
                {navLinks.map((link, i) => (
                  <m.li key={link.id} variants={fadeUp}>
                    <a
                      href={`#${link.id}`}
                      className={`mobile-menu__link${activeId === link.id ? ' is-active' : ''}`}
                      aria-current={activeId === link.id ? 'true' : undefined}
                      onClick={closeMenu}
                    >
                      <span className="mobile-menu__index">{String(i + 1).padStart(2, '0')}</span>
                      {link.label}
                    </a>
                  </m.li>
                ))}
              </m.ul>
            </nav>

            <div className="mobile-menu__footer">
              <p className="nav__status nav__status--menu">
                <span className="status-dot" aria-hidden="true" />
                {profile.status}
              </p>
              <ul className="mobile-menu__socials">
                {socialLinks.map(({ id, label, href, icon: Icon, ...link }) => (
                  <li key={id}>
                    <a href={href} className="icon-link" aria-label={label} {...linkProps(link)}>
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
