// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import Intro from './components/intro';
import type { ContextRouter } from 'react-router';

type Props = {
  ...$Exact<ContextRouter>,
};

class Concierge extends React.Component<Props> {
  render() {
    return (
      <Wrapper data-cy="concierge-page">
        <Intro />
        <PageFooter />
      </Wrapper>
    );
  }
}

export { Intro };

export default Concierge;
