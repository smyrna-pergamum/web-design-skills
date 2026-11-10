/** Facts about the product. Every value here comes from the LANORA README or the 1.3.1 release notes. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://smyrna-pergamum.github.io/lanora-website').replace(/\/$/, '');

export const REPO = 'https://github.com/smyrna-pergamum/Lanora';
export const LINKS = {
  repo: REPO,
  docs: `${REPO}#technical-documentation`,
  cli: `${REPO}#command-line`,
  privacy: `${REPO}#privacy`,
  license: `${REPO}/blob/main/LICENSE`,
  issues: `${REPO}/issues`,
  releases: `${REPO}/releases`,
  latest: `${REPO}/releases/latest`
};

export const RELEASE = {
  version: '1.3.1',
  platform: 'Windows 10/11 x64',
  installer: 'Lanora-1.3.1-Setup-x64.exe',
  portable: 'Lanora-1.3.1-Portable-x64.zip',
  license: 'GPL-3.0'
};

export const META = {
  title: 'Lanora — Local Network Discovery & Security Intelligence',
  description:
    'Discover devices, inspect open ports and understand your network with Lanora, a free, open-source network scanner for Windows that keeps its results on your computer.'
};
