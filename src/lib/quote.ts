// "Ajánlatkérés" opens a pre-filled e-mail, so the visitor sends the details a
// quote actually needs instead of landing on the bare contact card.
const subject = 'Ajánlatkérés – műszaki ellenőrzés / FMV';
const body = [
  'Tisztelt Czidor Úr!',
  '',
  'Ajánlatot szeretnék kérni az alábbi projektre:',
  '',
  'Helyszín (település):',
  'Projekt típusa (új építés / felújítás / ipari / egyéb):',
  'Kért szolgáltatás (műszaki ellenőrzés / felelős műszaki vezetés):',
  'Tervezett kezdés és időtartam:',
  'Rendelkezésre álló dokumentumok (terv, engedély, költségvetés):',
  'Telefonszám a visszahíváshoz:',
  '',
  'Üdvözlettel:',
].join('\r\n');

export const QUOTE_MAILTO = `mailto:gepm.kft@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
