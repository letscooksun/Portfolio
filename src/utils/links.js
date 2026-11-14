/* Spread onto <a> elements that open in a new tab (other sites, the resume PDF). */
export const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' };

export const linkProps = (link) => (link.external ? externalLinkProps : {});
