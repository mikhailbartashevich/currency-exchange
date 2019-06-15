import {
  CHANGE_INPUT_AMOUNT,
  CHANGE_OUTPUT_AMOUNT,
  CHANGE_OUTPUT_CURRENCY,
  CHANGE_INPUT_CURRENCY,
  LOAD_CURRENCY_RATES,
  RECEIVE_CURRENCY_RATES,
  ERROR_CURRENCY_RATES,
  EXCHANGE,
} from '../actions/currencyExchangeActions';

export const initialState = {
  inputAmount: 0.0,
  inputCurrency: { currency: 'EUR', symbol: '€' },
  outputAmount: 0.0,
  outputCurrency: { currency: 'USD', symbol: '$' },
  currencyOptions: [
    { currency: 'USD', symbol: '$' },
    { currency: 'EUR', symbol: '€' },
    { currency: 'GBP', symbol: '£' },
  ],
  currencyRate: 1.13,
  loadingRates: false,
  availableInputAmount: 100,
  availableOutputAmount: 100,
  pocket: [
    { currency: 'USD', amount: 100 },
    { currency: 'EUR', amount: 100 },
    { currency: 'GBP', amount: 100 },
  ],
};

const findMoney = (pocket, currency) => {
  const money = pocket.find(money => money.currency === currency.currency);
  return money ? money.amount : 0;
};

const updatePocket = state => {
  if (
    state.inputCurrency === state.outputCurrency ||
    state.availableInputAmount < state.inputAmount
  ) {
    return state.pocket;
  }
  return state.pocket.map(money => {
    if (money.currency === state.inputCurrency) {
      return { ...money, amount: (money.amount -= state.inputAmount) };
    }
    if (money.currency === state.outputCurrency) {
      return { ...money, amount: (money.amount += state.outputAmount) };
    }
    return money;
  });
};

export const currencyExchange = (state = initialState, action) => {
  switch (action.type) {
    case EXCHANGE:
      const pocket = updatePocket(state);
      return {
        ...state,
        inputAmount: 0,
        outputAmount: 0,
        availableInputAmount: findMoney(pocket, state.inputCurrency),
        availableOutputAmount: findMoney(pocket, state.outputCurrency),
        pocket,
      };
    case CHANGE_INPUT_AMOUNT:
      return {
        ...state,
        inputAmount: action.amount,
        outputAmount:
          Math.round(action.amount * state.currencyRate * 100) / 100,
      };
    case CHANGE_INPUT_CURRENCY:
      return {
        ...state,
        inputCurrency: action.currency,
        availableInputAmount: findMoney(state.pocket, action.currency),
      };
    case CHANGE_OUTPUT_AMOUNT:
      return {
        ...state,
        inputAmount:
          Math.round((action.amount / state.currencyRate) * 100) / 100,
        outputAmount: action.amount,
      };
    case CHANGE_OUTPUT_CURRENCY:
      return {
        ...state,
        outputCurrency: action.currency,
        availableOutputAmount: findMoney(state.pocket, action.currency),
      };
    case LOAD_CURRENCY_RATES:
      return {
        ...state,
        loadingRates: true,
      };
    case RECEIVE_CURRENCY_RATES:
      return {
        ...state,
        loadingRates: false,
        currencyRate: Math.round(action.rate * 100) / 100,
      };
    case ERROR_CURRENCY_RATES:
      return {
        ...state,
        loadingRates: false,
      };
    default:
      return state;
  }
};
