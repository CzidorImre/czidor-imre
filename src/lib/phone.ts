// Single source of truth for the business phone number.
//
// Stored base64-encoded on purpose: harvester bots that build spam call lists
// are regex crawlers over raw HTML and shipped JS, and they do not render the
// page. Keeping only the encoded form in source means the number never appears
// as a digit string in the build output. PhoneReveal.astro decodes it in the
// browser, on click.
//
// Decodes to the display form; the tel: href is derived by stripping spaces.
// The schema.org `telephone` field in index.astro is deliberately NOT encoded —
// search engines need it in the clear for local SEO.
export const PHONE_ENCODED = 'KzM2IDIwIDk0MiA1NzA3';
