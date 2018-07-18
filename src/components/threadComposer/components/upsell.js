// @flow
import * as React from 'react';
import { ComposerUpsell, UpsellPulse, UpsellDot } from '../style';

export default class Upsell extends React.Component<{}> {
  render() {
    return (
      <ComposerUpsell>
        <UpsellDot />
        <UpsellPulse />
        <p>在你的社区发布一个新的话题吧.</p>
      </ComposerUpsell>
    );
  }
}
