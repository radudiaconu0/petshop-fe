import {onMounted, ref} from 'vue';
import {parseStringPromise} from 'xml2js';

export function useCurrencyConverter() {
  const rates = ref<Map<string, number>>(new Map());

  const fetchRates = async () => {
    try {
      const response = await fetch('/src/coin/eurofxref-daily.xml');
      const xmlString = await response.text();
      const result = await parseStringPromise(xmlString);
      const rawRates = result['gesmes:Envelope'].Cube[0].Cube[0].Cube;

      const newRates = new Map<string, number>();
      rawRates.forEach((rate: any) => {
        newRates.set(rate.$.currency, parseFloat(rate.$.rate));
      });

      rates.value = newRates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const convertCurrency = (amount: number, targetCurrency: string): string => {
    const euroToTargetRate = rates.value.get(targetCurrency) || 1;
    const targetAmount = amount * euroToTargetRate;

    return formatCurrency(targetAmount, targetCurrency);
  };

  function formatCurrency(amount: number, currency: string): string {
    const currencySymbols: { [key: string]: string } = {
      "CNY": "¥",
      "EUR": "€",
      "USD": "$"
    };

    const defaultSymbol: string = "¥";
    const symbol: string = currencySymbols[currency] || defaultSymbol;

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    };

    const formattedAmount: string = new Intl.NumberFormat('de-DE', options).format(amount);

    switch (symbol) {
      case "€":
        return `${formattedAmount} ${symbol}`;
      default:
        return `${symbol}${formattedAmount}`;
    }
  }

  onMounted(fetchRates);

  return {
    rates,
    convertCurrency
  };
}
