// @flow
import * as React from 'react';
import { Overview } from '../view';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';

type State = {
  preferredSigninMethod: string,
};

class Splash extends React.Component<{}, State> {
  render() {
    return (
      <Wrapper data-cy="home-page">
        <Overview />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Splash;
