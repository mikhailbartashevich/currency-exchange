import React from 'react';
import './Balance.css';
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import { CurrencyPropType } from '../../model/currency.model';

export const BalanceRaw = props => (
  <span className="Balance">
    {props.amount} {props.currency ? props.currency.symbol : ''}
  </span>
);

BalanceRaw.propTypes = {
  amount: PropTypes.number,
  currency: CurrencyPropType,
};

export const Balance = pure(BalanceRaw);
