// @ts-check

/**
 * Favorites — persist a per-user list of favorite drug keys in localStorage
 * so they can be sorted to the top of the sidebar list across reloads.
 */

const KEY = 'pkpd:favorites:v1';

/**
 * @returns {string[]}
 */
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * @param {string[]} list
 */
function save(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota or privacy mode — silently ignore */
  }
}

/**
 * @returns {string[]}
 */
export function getFavorites() {
  return load();
}

/**
 * @param {string} key
 * @returns {boolean}
 */
export function isFavorite(key) {
  return load().includes(key);
}

/**
 * Toggle a drug's favorite state. Returns the new full list.
 * @param {string} key
 * @returns {string[]}
 */
export function toggleFavorite(key) {
  const list = load();
  const idx = list.indexOf(key);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(key);
  save(list);
  return list;
}

/**
 * Sort an array of drug keys so favorites come first, preserving the
 * original ordering within each group (favorites and non-favorites).
 * @param {string[]} keys
 * @returns {string[]}
 */
export function sortByFavorite(keys) {
  const favs = new Set(load());
  return keys.slice().sort((a, b) => {
    const fa = favs.has(a) ? 0 : 1;
    const fb = favs.has(b) ? 0 : 1;
    return fa - fb;
  });
}
