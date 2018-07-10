// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import Paid from './components/paid';
import Intro from './components/intro';
import Discount from './components/discount';
import Faq from './components/faq';
import { Intro as Concierge } from '../concierge';
import type { ContextRouter } from 'react-router';

type Props = {
  ...$Exact<ContextRouter>,
};

class Pricing extends React.Component<Props> {
  render() {
    return (
      <Wrapper data-cy="pricing-page">
        <Intro />
        <Paid />
        <Concierge goopColor={'space.dark'} />
        <Discount />
        <Faq />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Pricing;
