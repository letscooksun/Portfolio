import { ArrowUp } from 'lucide-react';
import { navLinks, profile, resumeLink, socialLinks } from '../data/portfolioData';
import { linkProps } from '../utils/links';

const ELSEWHERE = resumeLink ? [...socialLinks, resumeLink] : socialLinks;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" className="wordmark">
              <span className="wordmark__mark" aria-hidden="true">
                {profile.initials}
              </span>
              <span className="wordmark__name">{profile.name}</span>
            </a>
            <p className="footer__bio">{profile.shortBio}</p>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <p className="footer__heading">Navigate</p>
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a className="footer__link" href={`#${link.id}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <p className="footer__heading">Elsewhere</p>
            <ul>
              {ELSEWHERE.map(({ id, label, href, ...link }) => (
                <li key={id}>
                  <a className="footer__link" href={href} {...linkProps(link)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            © {year} {profile.name}. Designed and built with React, Vite &amp; Framer Motion.
          </p>
          <a className="back-to-top" href="#top">
            Back to top
            <span className="back-to-top__icon" aria-hidden="true">
              <ArrowUp size={14} strokeWidth={2} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
