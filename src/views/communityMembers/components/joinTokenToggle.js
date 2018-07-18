// @flow
import * as React from 'react';
import { Checkbox } from '../../../components/formElements';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import enableTokenJoinMutation from '../../../graphql/mutations/community/enableCommunityTokenJoin';
import disableTokenJoinMutation from '../../../graphql/mutations/community/disableCommunityTokenJoin';
import { addToastWithTimeout } from '../../../actions/toasts';

type Props = {
  id: string,
  settings: {
    tokenJoinEnabled: boolean,
  },
  enableCommunityTokenJoin: Function,
  disableCommunityTokenJoin: Function,
  dispatch: Function,
};

class TokenJoinToggle extends React.Component<Props> {
  init = () => {
    return this.props.settings.tokenJoinEnabled
      ? this.disable()
      : this.enable();
  };

  disable = () => {
    return this.props
      .disableCommunityTokenJoin({ id: this.props.id })
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('neutral', '链接失效')
        );
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  enable = () => {
    return this.props
      .enableCommunityTokenJoin({ id: this.props.id })
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('success', '链接激活')
        );
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { tokenJoinEnabled } = this.props.settings;

    return (
      <Checkbox
        checked={tokenJoinEnabled}
        onChange={this.init}
        dataCy="toggle-token-link-invites"
      >
        允许用户通过链接加入
      </Checkbox>
    );
  }
}

export default compose(
  connect(),
  enableTokenJoinMutation,
  // $FlowFixMe
  disableTokenJoinMutation
)(TokenJoinToggle);
