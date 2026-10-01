interface PublicConfig { apiUrl?: string; backofficeUrl?: string; frontofficeUrl?: string; }
const config: PublicConfig = (globalThis as typeof globalThis & { __SIGRH_CONFIG__?: PublicConfig }).__SIGRH_CONFIG__ ?? {};
function baseUrl(value: string): string {
  const url = new URL(value, window.location.origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Invalid public application URL');
  }
  return url.href.replace(/\/?$/, '/');
}
export const runtimeConfig = {
  apiUrl: baseUrl(config.apiUrl ?? 'http://localhost:9080/api/v1/mfpai/'),
  backofficeUrl: baseUrl(config.backofficeUrl ?? 'http://localhost:4200/'),
  frontofficeUrl: baseUrl(config.frontofficeUrl ?? 'http://localhost:4200/')
};
