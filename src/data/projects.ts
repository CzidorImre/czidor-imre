// Reference projects. Single source for the main page's reference grid
// (Portfolio.astro) and the town pages (pages/muszaki-ellenor/[varos].astro).

export type Role = 'me' | 'fmv';
export type Category = 'lakoepuletek' | 'kozepuletek' | 'ipari' | 'bank';

export interface Project {
  title: string;
  town: string;
  year: string;
  role: Role;
  cat: Category;
  desc: string;
}

export const catLabel: Record<Category, string> = {
  lakoepuletek: 'Lakóépületek',
  kozepuletek: 'Középületek',
  ipari: 'Ipari',
  bank: 'Bank · iroda',
};

export const roleLabel: Record<Role, string> = {
  me: 'Műszaki ellenőrzés',
  fmv: 'Felelős műsz. vezetés',
};

// The featured project shown above the grid on the main page.
export const featuredProject: Project = {
  title: 'Birla Carbon Hungary, 4. gyártósor technológiai alapozása',
  town: 'Tiszaújváros',
  year: '2024–25',
  role: 'fmv',
  cat: 'ipari',
  desc: 'Nehézipari technológiai alapozás feszített ütemtervvel és kritikus geometriai tűréshatárokkal.',
};

// Newest first, the order the main page shows them in.
export const projects: Project[] = [
  { title: 'Családi ház kivitelezése, Vass Albert u.', town: 'Bükkaranyos', year: '2024', role: 'me', cat: 'lakoepuletek', desc: 'Új építésű családi ház teljes kivitelezésének műszaki ellenőrzése.' },
  { title: 'Gabonatároló építése, Eper út', town: 'Mezőkövesd', year: '2023', role: 'fmv', cat: 'ipari', desc: 'Mezőgazdasági gabonatároló létesítmény építése.' },
  { title: 'Mezőkövesd Ipari Park fejlesztése, I–III. ütem', town: 'Mezőkövesd', year: '2020–23', role: 'fmv', cat: 'ipari', desc: 'Háromütemű ipari park infrastruktúra- és csarnokfejlesztés, közbeszerzés keretében.' },
  { title: 'Rózsa Étterem bővítése konferenciateremmel', town: 'Mezőkövesd', year: '2022', role: 'fmv', cat: 'kozepuletek', desc: 'Meglévő étterem bővítése akusztikailag optimalizált teremmel.' },
  { title: 'JET Transzport, logisztikai csarnokbővítés', town: 'Miskolc', year: '2022', role: 'me', cat: 'ipari', desc: 'Csarnokbővítés meglévő üzem mellett, folyamatos forgalomban.' },
  { title: 'Zsóry gyógy- és egészségpark fejlesztése', town: 'Mezőkövesd', year: '2020', role: 'fmv', cat: 'kozepuletek', desc: 'Gyógy- és egészségpark kivitelezési munkái.' },
  { title: 'Lakóépület, Pöltenberg E. u.', town: 'Miskolc', year: '2020', role: 'me', cat: 'lakoepuletek', desc: '' },
  { title: 'Mezőkövesdi Járási Kormányhivatal épülete', town: 'Mezőkövesd', year: '2019', role: 'fmv', cat: 'kozepuletek', desc: 'Közigazgatási épület, akadálymentes megközelítéssel.' },
  { title: 'Bogács, Gyógy- és Strandfürdő, öltöző és bejárat', town: 'Bogács', year: '2018', role: 'fmv', cat: 'kozepuletek', desc: 'Öltöző és bejárati épületrész működő fürdő mellett.' },
  { title: 'Berente, volt bányaépület felújítása, átalakítása', town: 'Berente', year: '2016', role: 'fmv', cat: 'ipari', desc: 'Komplex felújítás és belső átalakítás, funkcióváltással.' },
  { title: 'Miskolci Állatkert, farkas- és hiúzkifutó', town: 'Miskolc', year: '2015', role: 'me', cat: 'kozepuletek', desc: 'Ragadozó kifutók, speciális biztonsági és állatjóléti követelményekkel.' },
  { title: 'Szikszói görögkatolikus templom, szerkezetépítés', town: 'Szikszó', year: '2015', role: 'me', cat: 'kozepuletek', desc: '' },
  { title: 'Társasház energetikai felújítása, Szilvás út', town: 'Miskolc', year: '2014', role: 'me', cat: 'lakoepuletek', desc: 'Paneles társasház komplex korszerűsítése, homlokzati hőszigeteléssel.' },
  { title: 'Bankfiók, Győri kapu', town: 'Miskolc', year: '2013', role: 'me', cat: 'bank', desc: '' },
  { title: 'Bankfiók, Agria park', town: 'Eger', year: '2012', role: 'me', cat: 'bank', desc: '' },
  { title: 'Miskolc Mechatronikai Park, VIZI & Co Kft.', town: 'Miskolc', year: '2011', role: 'me', cat: 'ipari', desc: 'Műhely és irodaépület mechatronikai park területén.' },
  { title: 'Piac u. – Hatvan u., 70 lakásos társasház', town: 'Debrecen', year: '2007', role: 'me', cat: 'lakoepuletek', desc: '70 lakás, 9 üzlet, bankfiók és 89 állásos teremgarázs.' },
  { title: 'Andor u. – Miklós u., 68 lakásos társasház', town: 'Miskolc', year: '2007', role: 'me', cat: 'lakoepuletek', desc: '30+38 lakásos együttes teremgarázzsal és irodaegységgel.' },
  { title: 'Régióközpont, szerkezetépítés', town: 'Miskolc', year: '2007', role: 'me', cat: 'bank', desc: '' },
  { title: 'Isonzó u., 22 lakásos társasház', town: 'Hajdúszoboszló', year: '2005', role: 'me', cat: 'lakoepuletek', desc: 'Társasház teremgarázzsal, üdülőövezeti kontextusban.' },
  { title: 'Perczel Mór u., 12 lakásos társasház', town: 'Miskolc', year: '2003', role: 'me', cat: 'lakoepuletek', desc: 'Az első önálló műszaki ellenőri referencia.' },
];

// Every project, featured one included. Used for the town pages.
export const allProjects: Project[] = [featuredProject, ...projects];
