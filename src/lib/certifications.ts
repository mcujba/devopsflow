/** Single source of truth for certifications: used by the page, footer, About and JSON-LD. */

export const ISSUERS = {
  "linux-foundation": "The Linux Foundation",
  juniper: "Juniper Networks",
  fortinet: "Fortinet",
  cisco: "Cisco",
  mikrotik: "MikroTik",
  lpi: "Linux Professional Institute",
  skillsoft: "Skillsoft",
} as const;

export type IssuerKey = keyof typeof ISSUERS;

const ISSUER_ORDER: IssuerKey[] = [
  "linux-foundation", "juniper", "fortinet", "cisco", "mikrotik", "lpi", "skillsoft",
];

export interface Certification {
  id: string;
  issuer: IssuerKey;
  name: string;
  /** Short label for compact lists (footer, About). Omitted for course badges. */
  short?: string;
  /** Year and month, `YYYY-MM`. */
  issued: string;
  expires?: string;
  credentialId?: string;
  verifyUrl?: string;
  /** Badge or certificate image under `public/`. */
  image?: string;
  /** Certificate file the visitor can download. */
  download?: string;
}

const credly = (badgeId: string) => `https://www.credly.com/badges/${badgeId}`;

export const certifications: Certification[] = [
  {
    id: "cka",
    issuer: "linux-foundation",
    name: "CKA: Certified Kubernetes Administrator",
    short: "CKA",
    issued: "2024-04",
    expires: "2027-04",
    verifyUrl: credly("9a298f5a-7ed6-4302-958a-b5d828485aa9"),
    image: "/certificates/cka.png",
  },
  {
    id: "jncis-ent",
    issuer: "juniper",
    name: "Juniper Networks Certified Specialist, Enterprise Routing & Switching (JNCIS-ENT)",
    short: "JNCIS-ENT",
    issued: "2020-06",
    expires: "2023-06",
    credentialId: "JPR00278040",
    verifyUrl: credly("885cf41f-302a-44cc-b24a-f9c62ae1cfa4"),
    image: "/certificates/jncis-ent.png",
  },
  {
    id: "jncia-sec",
    issuer: "juniper",
    name: "Juniper Networks Certified Associate, Security (JNCIA-SEC)",
    short: "JNCIA-SEC",
    issued: "2020-09",
    expires: "2023-09",
    credentialId: "JPR00278040",
    verifyUrl: credly("9dd00292-8e12-4001-a64e-9ddfccef1f08"),
    image: "/certificates/jncia-sec.png",
  },
  {
    id: "jncia-devops",
    issuer: "juniper",
    name: "Juniper Networks Certified Associate, Automation and DevOps (JNCIA-DevOps)",
    short: "JNCIA-DevOps",
    issued: "2020-08",
    expires: "2023-09",
    credentialId: "JPR00278040",
    verifyUrl: credly("7172b204-5704-40e9-b8fe-874a35bac1b3"),
    image: "/certificates/jncia-devops.png",
  },
  {
    id: "jncia-junos",
    issuer: "juniper",
    name: "Juniper Networks Certified Associate, Junos (JNCIA-Junos)",
    short: "JNCIA-Junos",
    issued: "2018-10",
    expires: "2023-09",
    credentialId: "JPR00278040",
    verifyUrl: credly("25798ebc-b80a-4b5a-8122-b76e5d53aacb"),
    image: "/certificates/jncia-junos.png",
  },
  {
    id: "nse5",
    issuer: "fortinet",
    name: "NSE 5 Network Security Analyst",
    short: "NSE 5",
    issued: "2020-03",
    expires: "2022-03",
    credentialId: "FORT042477",
  },
  {
    id: "fortimanager",
    issuer: "fortinet",
    name: "Fortinet FortiManager 6.0 Administrator",
    issued: "2020-03",
    verifyUrl: credly("cdd18ec8-424a-4e93-a307-faf78d8c065b"),
    image: "/certificates/fortimanager.png",
  },
  {
    id: "fortianalyzer",
    issuer: "fortinet",
    name: "Fortinet FortiAnalyzer 6.0 Administrator",
    issued: "2020-02",
    verifyUrl: credly("fc5d9cab-333e-4101-9e56-40412ca93f09"),
    image: "/certificates/fortianalyzer.png",
  },
  {
    id: "nse4",
    issuer: "fortinet",
    name: "NSE 4 Network Security Professional",
    short: "NSE 4",
    issued: "2018-11",
    expires: "2021-11",
    credentialId: "FORT042477",
  },
  {
    id: "cisco-route",
    issuer: "cisco",
    name: "Implementing Cisco IP Routing",
    issued: "2019-03",
    expires: "2022-03",
    credentialId: "CSCO12473197",
  },
  {
    id: "ccna",
    issuer: "cisco",
    name: "Cisco Certified Network Associate Routing and Switching (CCNA Routing and Switching)",
    short: "CCNA",
    issued: "2017-10",
    expires: "2022-09",
    credentialId: "CSCO12473197",
    verifyUrl: credly("9b3dbdd8-ab7d-4b46-acae-93bede53ced9"),
    image: "/certificates/ccna.png",
  },
  {
    id: "cisco-network-devices",
    issuer: "cisco",
    name: "Understanding of Cisco Network Devices",
    issued: "2020-02",
    verifyUrl: credly("46e49f22-f777-4686-ba11-90fae2ebf872"),
    image: "/certificates/cisco-network-devices.png",
  },
  {
    id: "mtcwe",
    issuer: "mikrotik",
    name: "MTCWE: MikroTik Certified Wireless Engineer",
    short: "MTCWE",
    issued: "2017-12",
    expires: "2020-12",
    credentialId: "1712WE9604",
    verifyUrl: "https://mikrotik.com/training/certificates/b109604c13bcf04b35d6",
    image: "/certificates/mtcwe.jpg",
    download: "/certificates/mtcwe.jpg",
  },
  {
    id: "mtcna",
    issuer: "mikrotik",
    name: "MTCNA: MikroTik Certified Network Associate",
    short: "MTCNA",
    issued: "2017-11",
    expires: "2020-11",
    credentialId: "1711NA7019",
    verifyUrl: "https://mikrotik.com/training/certificates/b107019c6714dcfb96f3",
    image: "/certificates/mtcna.jpg",
    download: "/certificates/mtcna.jpg",
  },
  {
    id: "lpic-1",
    issuer: "lpi",
    name: "LPIC-1: Linux Server Professional Certification",
    short: "LPIC-1",
    issued: "2017-10",
    expires: "2022-10",
    credentialId: "LPI000388632",
  },
  {
    id: "owasp",
    issuer: "skillsoft",
    name: "OWASP: Open Web Application Security Project",
    issued: "2021-04",
    verifyUrl: "https://eu.credential.net/profile/eu-maximcujba846283",
  },
];

export function certificationsByIssuer() {
  return ISSUER_ORDER.map((issuer) => ({
    issuer,
    name: ISSUERS[issuer],
    items: certifications.filter((cert) => cert.issuer === issuer),
  }));
}

function formatMonth(yearMonth: string, locale: string): string {
  return new Date(`${yearMonth}-01T00:00:00Z`).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatPeriod(cert: Certification, locale: string): string {
  const issued = formatMonth(cert.issued, locale);
  return cert.expires ? `${issued} – ${formatMonth(cert.expires, locale)}` : issued;
}

/** Credentials whose validity period includes the given day. */
export function currentCertifications(now: Date = new Date()): Certification[] {
  const month = now.toISOString().slice(0, 7);
  return certifications.filter((cert) => cert.expires !== undefined && cert.expires >= month);
}
