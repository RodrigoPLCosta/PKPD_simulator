// @ts-check

/**
 * Inline SVG icon set (Lucide-style: 24x24 viewBox, 1.75 stroke width, currentColor).
 *
 * Returns a string with the full <svg> markup so it can be used in
 * `element.innerHTML = `${icon('save')} Salvar`` patterns or in template literals.
 */

const ICONS = {
  // App brand mark — stylised PK curve + dose tick
  brand:
    '<path d="M3 17l4-7 4 4 5-9 5 8"/><path d="M3 21h18"/>',

  // Header / toolbar actions
  undo:
    '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H10"/>',
  save:
    '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  trash:
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  sun:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/>',
  moon:
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  palette:
    '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 22a10 10 0 1 1 10-10c0 5-5 4-5 7s-3 3-5 3z"/>',

  // Sidebar section / control icons
  shield:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  search:
    '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  star:
    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  starFilled:
    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>',
  user:
    '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 16 0v1"/>',
  weight:
    '<path d="M5 6h14l1 14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="11" r="3"/><path d="M12 6V4"/>',
  kidney:
    '<path d="M14 4c-3 0-5 2-5 5 0 2-2 3-3 5-1 2-1 5 1 7s5 2 7 1 3-3 4-5c1-2 3-3 3-6 0-4-3-7-7-7z"/>',
  pill:
    '<rect x="3" y="9" width="18" height="6" rx="3"/><path d="M12 9v6"/>',
  clock:
    '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  drop:
    '<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/>',
  syringe:
    '<path d="M16 2l6 6"/><path d="M14 4l6 6"/><path d="M19 7L9 17l-3 1-1 3 3-1 1-3L19 7z"/><path d="M5 19l-3 3"/>',
  syringeSmall:
    '<path d="M16 2l6 6"/><path d="M19 7L9 17l-3 1-1 3 3-1 1-3L19 7z"/>',

  // Metric card icons
  curve:
    '<path d="M3 17c4 0 4-10 9-10s5 10 9 10"/>',
  arrowDown:
    '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/>',
  arrowUp:
    '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
  bell:
    '<path d="M3 17c4-1 4-12 9-12s5 11 9 12"/><path d="M3 17h18"/>',
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',

  // Status / info card icons
  check:
    '<polyline points="5 12 10 17 20 7"/>',
  checkCircle:
    '<circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/>',
  flask:
    '<path d="M9 3h6"/><path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.25h12.4A1.5 1.5 0 0 0 19.5 19L14 9V3"/><path d="M7 14h10"/>',
  info:
    '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/>',
  alertTriangle:
    '<path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/>',

  // Misc UI
  chevronDown:
    '<polyline points="6 9 12 15 18 9"/>',
  chevronRight:
    '<polyline points="9 6 15 12 9 18"/>',
  eye:
    '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  plus:
    '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus:
    '<line x1="5" y1="12" x2="19" y2="12"/>'
};

/**
 * Render an icon as an SVG string.
 * @param {string} name — key in ICONS
 * @param {{ size?: number, stroke?: number, className?: string, title?: string }} [opts]
 * @returns {string}
 */
export function icon(name, opts = {}) {
  const path = ICONS[name];
  if (!path) return '';
  const size = opts.size || 18;
  const stroke = opts.stroke || 1.75;
  const cls = opts.className ? ` class="${opts.className}"` : ' class="ic"';
  const title = opts.title ? `<title>${opts.title}</title>` : '';
  return (
    `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="${stroke}" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    `${title}${path}</svg>`
  );
}

/**
 * Inject an SVG icon as the first child of a target element, replacing any
 * existing icon (an element with the `.ic` class).
 * @param {HTMLElement | null} el
 * @param {string} name
 * @param {Parameters<typeof icon>[1]} [opts]
 */
export function setIcon(el, name, opts) {
  if (!el) return;
  const existing = el.querySelector(':scope > .ic');
  if (existing) existing.remove();
  el.insertAdjacentHTML('afterbegin', icon(name, opts));
}

export default { icon, setIcon };
