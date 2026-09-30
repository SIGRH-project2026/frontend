import { readFileSync, writeFileSync } from 'node:fs';
const values = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8')
  .split(/\r?\n/).filter(line => line.trim() && !line.trim().startsWith('#')).map(line => {
    const i = line.indexOf('=');
    if (i < 1) throw new Error('Invalid .env line');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  }));
const config = {};
for (const [key, name] of Object.entries({ PUBLIC_API_URL: 'apiUrl', PUBLIC_FRONTOFFICE_URL: 'frontofficeUrl', PUBLIC_BACKOFFICE_URL: 'backofficeUrl' })) {
  const url = new URL(values[key]);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error(`Invalid ${key}`);
  config[name] = url.href.replace(/\/?$/, '/');
}
writeFileSync(new URL('../src/assets/runtime-config.js', import.meta.url), `window.__SIGRH_CONFIG__ = ${JSON.stringify(config)};\n`);
console.log('Public runtime URLs configured. No backend secrets are copied.');
