/**
 * Sample network shown in the scene. It is based on the overview screenshot in the LANORA README
 * (192.168.2.0/24, gateway, this computer, an unidentified device, indicator 90) and extended with
 * a few typical home devices. Everything that uses it is labelled "Sample data" on the page.
 */
export type Device = {
  id: string;
  name: string;
  ip: string;
  vendor: string;
  type: string;
  status: string;
  via: string;
  ports: string[];
};

export const NETWORK = { cidr: '192.168.2.0/24', probed: 254, score: 90, coverage: 90 };

export const DEVICES: Device[] = [
  { id: 'gw', name: 'Gateway', ip: '192.168.2.1', vendor: 'Arcadyan (IEEE OUI)', type: 'Gateway / router', status: 'Informational', via: 'ICMP · ARP', ports: ['53/tcp', '80/tcp', '443/tcp'] },
  { id: 'pc', name: 'This computer', ip: '192.168.2.115', vendor: '—', type: 'Computer', status: 'Medium priority', via: 'Local adapter', ports: ['135/tcp', '139/tcp', '445/tcp'] },
  { id: 'pr', name: 'Printer', ip: '192.168.2.40', vendor: 'Printer vendor (IEEE OUI)', type: 'Printer', status: 'Informational', via: 'ICMP · ARP · TCP', ports: ['80/tcp', '631/tcp', '9100/tcp'] },
  { id: 'ud', name: 'Unidentified device', ip: '192.168.2.88', vendor: 'uncertain (random MAC)', type: 'Unknown', status: 'No open port observed', via: 'ARP', ports: [] },
  { id: 'tv', name: 'TV', ip: '192.168.2.33', vendor: 'TV vendor (IEEE OUI)', type: 'Media device', status: 'Informational', via: 'ICMP · ARP', ports: ['8008/tcp', '8009/tcp'] },
  { id: 'nas', name: 'Storage', ip: '192.168.2.20', vendor: 'NAS vendor (IEEE OUI)', type: 'Storage (NAS)', status: 'Informational', via: 'ICMP · ARP · TCP', ports: ['5000/tcp', '5001/tcp'] },
  { id: 'ph', name: 'Phone', ip: '192.168.2.57', vendor: 'uncertain (random MAC)', type: 'Phone (estimate)', status: 'No open port observed', via: 'ARP', ports: [] }
];

export type PortRing = { port: string; service: string; state: 'open' | 'open|filtered' | 'closed'; radius: number; tilt: [number, number, number]; finding?: boolean };

/** Ports of "This computer" shown as rings. UDP comes from the advanced scan. */
export const PORT_RINGS: PortRing[] = [
  { port: '135/TCP', service: 'RPC', state: 'open', radius: 2.0, tilt: [0.5, 0, 0.2] },
  { port: '139/TCP', service: 'NetBIOS', state: 'open', radius: 2.7, tilt: [-0.35, 0, 0.5] },
  { port: '445/TCP', service: 'SMB', state: 'open', radius: 3.4, tilt: [0.15, 0, -0.4], finding: true },
  { port: '5353/UDP', service: 'mDNS', state: 'open|filtered', radius: 4.1, tilt: [-0.6, 0, -0.1] },
  { port: '3389/TCP', service: 'RDP', state: 'closed', radius: 4.8, tilt: [0.25, 0, 0.65] }
];

/** Two findings, word for word from LANORA's src/Lanora/Resources/ruleset.json (R04, R06). */
export const FINDINGS = [
  {
    id: 'R04', severity: 'medium' as const, where: '445/TCP · This computer', title: 'File sharing (SMB)',
    observed: 'TCP 445 is open; this port is used for Windows file and printer sharing (SMB).',
    meaning: 'File sharing is common on local networks. What matters is who can access the shared folders.',
    action: 'If you do not need sharing, consider turning it off. If you do, review share permissions, keep guest access disabled, and keep the system updated.',
    verify: 'Rescan with the same network and profile to compare the port state.'
  },
  {
    id: 'R06', severity: 'info' as const, where: '80/TCP · Gateway', title: 'Web interface (HTTP/HTTPS)',
    observed: 'TCP 80 is open; the device may offer a web service.',
    meaning: 'Routers, printers and smart devices often use a web interface for management. This alone is not a problem.',
    action: 'Make sure the admin interface does not use a default password and that the firmware is up to date.',
    verify: "This informational item does not affect the score. You can check the version on the device's admin page."
  }
];
