import React from 'react';
import './Balance.css';

export function Balance(props) {
  return (
    <span className="Balance">
      <span>{props.amount}&nbsp;</span>
      <span>{props.currency.symbol}</span>
    </span>
  );
}