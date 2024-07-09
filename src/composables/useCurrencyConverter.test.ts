import {describe, it, expect, vi, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useCurrencyConverter} from './useCurrencyConverter';

// Mock XML data
const mockXmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01">
  <Cube>
    <Cube time="2023-07-09">
      <Cube currency="USD" rate="1.0950"/>
      <Cube currency="CNY" rate="7.9083"/>
    </Cube>
  </Cube>
</gesmes:Envelope>
`;

// Mock fetch function
global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) =>
  Promise.resolve({
    text: () => Promise.resolve(mockXmlData),
  } as Response)
);

describe('useCurrencyConverter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches rates on mount', async () => {
    const wrapper = mount({
      template: '<div></div>',
      setup() {
        return useCurrencyConverter();
      },
    });

    await wrapper.vm.$nextTick();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/src/coin/eurofxref-daily.xml');
  });`q`

  it('converts currency correctly', async () => {
    const {convertCurrency, rates} = useCurrencyConverter();

    // Manually set rates for testing
    rates.value = new Map([
      ['USD', 1.0950],
      ['CNY', 7.9083],
    ]);

    expect(convertCurrency(100, 'USD')).toBe('$109,50');
    expect(convertCurrency(100, 'CNY')).toBe('¥790,83');
    expect(convertCurrency(100, 'EUR')).toBe('100,00 €');
  });

  it('handles unknown currencies', () => {
    const {convertCurrency, rates} = useCurrencyConverter();

    rates.value = new Map([
      ['USD', 1.0950],
      ['CNY', 7.9083],
    ]);

    expect(convertCurrency(100, 'GBP')).toBe('¥100,00');
  });

  it('formats currency correctly', () => {
    const {convertCurrency, rates} = useCurrencyConverter();

    rates.value = new Map([
      ['USD', 1.0950],
      ['CNY', 7.9083],
      ['EUR', 1],
    ]);

    expect(convertCurrency(1234567.89, 'USD')).toBe('$1.351.851,84');
    expect(convertCurrency(1234567.89, 'CNY')).toBe('¥9.763.333,24');
    expect(convertCurrency(1234567.89, 'EUR')).toBe('1.234.567,89 €');
  });
});
