import CryptoConvert from 'crypto-convert';

export const convert = new CryptoConvert({
  cryptoInterval: 10000,//Crypto prices update interval in ms
  fiatInterval: 60 * 1e3 * 60,//Fiat prices update interval
  calculateAverage: true,//Calculate the average crypto price from exchanges
  binance: true,//Use binance rates
  bitfinex: true,//Use bitfinex rates
  coinbase: true,//Use coinbase rates
  kraken: true, //Use kraken rates
});
