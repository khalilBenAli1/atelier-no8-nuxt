import { describe, expect, it } from 'vitest';
import { validateCheckout } from '../lib/checkout';
describe('demo checkout validation', () => {
  it('requires valid contact, supported destination and simulation consent', () => {
    expect(
      Object.keys(
        validateCheckout({
          name: '',
          email: 'bad',
          country: '',
          consent: false,
        }),
      ),
    ).toHaveLength(4);
    expect(
      validateCheckout({
        name: 'Alex Morgan',
        email: 'alex@example.com',
        country: 'France',
        consent: true,
      }),
    ).toEqual({});
  });
});
