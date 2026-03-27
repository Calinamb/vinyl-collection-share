import { t } from "./modules/i18n.mjs";

export function translatePage(translations) {
  for (const [id, key] of Object.entries(translations)) {
    const el = document.getElementById(id);
    if (el) el.innerText = t(key);
  }
}

export function translatePlaceholders(translations) {
  for (const [id, key] of Object.entries(translations)) {
    const el = document.getElementById(id);
    if (el) el.placeholder = t(key);
  }
}