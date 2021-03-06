// @flow
import * as React from 'react';
import Icon from '../../icons';
import { PoweredByStripeFooter } from '../styles';

export default class PoweredByStripe extends React.Component<{}> {
  render() {
    return (
      <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
        <PoweredByStripeFooter>
          <Icon glyph={'channel-private'} size={24} />
          Secured and encrypted with
          <img
            alt={'Stripe logo'}
            src={'/img/stripe-logo.png'}
            width={36}
            height={15}
          />
        </PoweredByStripeFooter>
      </a>
    );
  }
}
