export interface CheckoutDetails {
  name: string;
  email: string;
  country: string;
  consent: boolean;
}
export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;
export const countries = ['France', 'Germany', 'Italy', 'Spain', 'Netherlands'];
const supportedLocalPart = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
export function validateCheckout(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (details.name.trim().length < 2 || details.name.trim().length > 100)
    errors.name = 'Enter a name between 2 and 100 characters.';
  if (
    details.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()) ||
    !supportedLocalPart.test(details.email.trim().split('@')[0] ?? '')
  )
    errors.email = 'Enter a valid email address.';
  if (!countries.includes(details.country))
    errors.country = 'Choose a demo destination.';
  if (!details.consent)
    errors.consent = 'Please confirm that this is a simulated order.';
  return errors;
}
