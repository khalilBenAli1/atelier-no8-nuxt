import { describe, expect, it } from 'vitest';
import { validateCheckout } from '../lib/checkout';
describe('demo checkout validation', () => {
  it.each(['alex<smith>@example.com', 'alex,smith@example.com'])(
    'rejects unsupported punctuation in an unquoted email local part: %s',
    (email) => {
      expect(
        validateCheckout({
          name: 'Alex Morgan',
          email,
          country: 'France',
          consent: true,
        }),
      ).toHaveProperty('email');
    },
  );
  it('preserves trimmed plus/dot addresses, international names and the existing length boundary', () => {
    for (const email of [
      '  alex.smith+studio@example.com  ',
      "o'brien+studio@example.co.uk",
      'a'.repeat(242) + '@example.com',
    ]) {
      expect(
        validateCheckout({
          name: '  Élodie 山田  ',
          email,
          country: 'France',
          consent: true,
        }),
      ).toEqual({});
    }
    expect(
      validateCheckout({
        name: 'Alex Morgan',
        email: 'a'.repeat(243) + '@example.com',
        country: 'France',
        consent: true,
      }),
    ).toHaveProperty('email');
  });
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
