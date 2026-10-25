// iOS system chrome the web preview can't draw: the status bar and the native (iOS 26) tab bar
// as NativeTabs configures it (tint #DFFF1F, icons #8C8C87, "+" detached on the right).
const ACCENT = '#DFFF1F';
const SUBTLE = '#8C8C87';

const ICONS = {
  training: (c) =>
    `<svg viewBox="0 0 28 28" width="27" height="27"><g fill="${c}"><rect x="1.5" y="10.5" width="3" height="7" rx="1.2"/><rect x="5" y="6.5" width="4.2" height="15" rx="1.6"/><rect x="9.2" y="12.4" width="9.6" height="3.2" rx="1"/><rect x="18.8" y="6.5" width="4.2" height="15" rx="1.6"/><rect x="23.5" y="10.5" width="3" height="7" rx="1.2"/></g></svg>`,
  level: (c, on) =>
    on
      ? `<svg viewBox="0 0 28 28" width="27" height="27"><g fill="${c}"><rect x="3.5" y="14" width="5.5" height="10" rx="1.4"/><rect x="11.25" y="8" width="5.5" height="16" rx="1.4"/><rect x="19" y="3.5" width="5.5" height="20.5" rx="1.4"/></g></svg>`
      : `<svg viewBox="0 0 28 28" width="27" height="27"><g fill="none" stroke="${c}" stroke-width="1.8"><rect x="4.4" y="14.9" width="3.7" height="8.2" rx="1"/><rect x="12.15" y="8.9" width="3.7" height="14.2" rx="1"/><rect x="19.9" y="4.4" width="3.7" height="18.7" rx="1"/></g></svg>`,
  body: (c) =>
    `<svg viewBox="0 0 28 28" width="27" height="27"><g fill="${c}"><circle cx="14" cy="4.6" r="2.7"/><path d="M10.6 8.6h6.8c1.3 0 2.3 1 2.4 2.3l.6 6.6c.07.8-.55 1.5-1.35 1.5-.7 0-1.28-.53-1.34-1.22l-.5-5.3h-.5v14.2c0 .9-.72 1.6-1.6 1.6s-1.6-.7-1.6-1.6v-7.6h-.04v7.6c0 .9-.72 1.6-1.6 1.6s-1.6-.7-1.6-1.6V12.5h-.5l-.5 5.3c-.06.7-.64 1.22-1.34 1.22-.8 0-1.42-.7-1.35-1.5l.6-6.6c.1-1.3 1.1-2.3 2.4-2.3z"/></g></svg>`,
  profile: (c, on) =>
    on
      ? `<svg viewBox="0 0 28 28" width="27" height="27"><circle cx="14" cy="14" r="12" fill="${c}"/><circle cx="14" cy="11" r="4.3" fill="#1b1b1b"/><path d="M6.3 21.6c1.7-2.9 4.6-4.4 7.7-4.4s6 1.5 7.7 4.4A10.6 10.6 0 0 1 14 25a10.6 10.6 0 0 1-7.7-3.4z" fill="#1b1b1b"/></svg>`
      : `<svg viewBox="0 0 28 28" width="27" height="27"><circle cx="14" cy="14" r="11.1" fill="none" stroke="${c}" stroke-width="1.8"/><circle cx="14" cy="11" r="4" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M7 21.4c1.6-2.6 4.1-3.9 7-3.9s5.4 1.3 7 3.9" fill="none" stroke="${c}" stroke-width="1.8"/></svg>`,
};

const TABS = [
  ['training', 'Training'],
  ['level', 'Level'],
  ['body', 'Body'],
  ['profile', 'Profile'],
];

function statusBar() {
  return `<div style="position:fixed;left:0;right:0;top:0;height:54px;z-index:2147483646;pointer-events:none;display:flex;align-items:center;justify-content:space-between;padding:6px 34px 0 50px;box-sizing:border-box;color:#fff;font:600 17px/1 -apple-system,'SF Pro Text','Inter',sans-serif;letter-spacing:-0.2px">
    <span style="padding-top:2px">9:41</span>
    <span style="display:flex;gap:7px;align-items:center">
      <svg width="19" height="12" viewBox="0 0 19 12"><g fill="#fff"><rect x="0" y="8" width="3.2" height="4" rx=".8"/><rect x="5" y="5.5" width="3.2" height="6.5" rx=".8"/><rect x="10" y="3" width="3.2" height="9" rx=".8"/><rect x="15" y="0" width="3.2" height="12" rx=".8"/></g></svg>
      <svg width="17" height="12" viewBox="0 0 17 12"><path fill="#fff" d="M8.5 2.4c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8.5.7 10.4 10.4 0 0 0 1.1 3.7l1.2 1.2a8.7 8.7 0 0 1 6.2-2.5zm0 3.4c1.5 0 2.8.6 3.8 1.5l1.2-1.2a7 7 0 0 0-5-2 7 7 0 0 0-5 2l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zm0 3.4c.6 0 1.1.2 1.5.6L8.5 11.3 7 9.8c.4-.4.9-.6 1.5-.6z"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="#fff" stroke-opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="#fff"/><path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill="#fff" fill-opacity=".45"/></svg>
    </span></div>`;
}

function tabBar(active) {
  const items = TABS.map(([key, label]) => {
    const on = key === active;
    const color = on ? ACCENT : SUBTLE;
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;height:54px;border-radius:27px;${on ? 'background:rgba(255,255,255,0.11);' : ''}">
      ${ICONS[key](color, on)}
      <span style="font:${on ? 600 : 500} 10px/12px -apple-system,'SF Pro Text','Inter',sans-serif;color:${color};letter-spacing:0.1px">${label}</span></div>`;
  }).join('');
  const glass =
    'background:rgba(30,30,30,0.72);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:inset 0 0.5px 0 rgba(255,255,255,0.22),inset 0 0 0 0.5px rgba(255,255,255,0.08),0 8px 24px rgba(0,0,0,0.45);';
  return `<div style="position:fixed;left:21px;right:21px;bottom:25px;height:62px;z-index:2147483646;display:flex;gap:10px;pointer-events:none">
    <div style="flex:1;display:flex;align-items:center;padding:4px;border-radius:31px;${glass}">${items}</div>
    <div style="width:62px;height:62px;border-radius:31px;display:flex;align-items:center;justify-content:center;${glass}">
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" stroke="${SUBTLE}" stroke-width="2.4" stroke-linecap="round"/></svg></div></div>`;
}

/** Adds the status bar, and the tab bar with `tab` selected (none on pushed screens). */
async function addChrome(page, { tab = null, home = false } = {}) {
  await page.evaluate(
    ({ html }) => {
      document.getElementById('preview-chrome')?.remove();
      const el = document.createElement('div');
      el.id = 'preview-chrome';
      el.innerHTML = html;
      document.body.appendChild(el);
    },
    { html: statusBar() + (tab ? tabBar(tab) : '') + (home ? homeIndicator() : '') },
  );
}

function homeIndicator() {
  return `<div style="position:fixed;left:50%;bottom:8px;width:144px;height:5px;margin-left:-72px;border-radius:3px;background:#fff;z-index:2147483646;pointer-events:none"></div>`;
}

module.exports = { addChrome };
