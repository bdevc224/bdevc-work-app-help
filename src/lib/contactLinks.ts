// FILE: src/lib/contactLinks.ts

/** Converts a displayed phone number into a valid tel: URI (keeps digits and a leading +). */
export function telHref(phone: string): string {
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}

/** Opens the location in Google Maps - works for a city, "City, Country", or a full address. */
export function mapsHref(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.trim())}`;
}
