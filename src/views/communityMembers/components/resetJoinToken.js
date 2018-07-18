// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import resetJoinTokenMutation from '../../../graphql/mutations/community/resetCommunityJoinToken';
import { addToastWithTimeout } from '../../../actions/toasts';
import { OutlineButton } from '../../../components/buttons';

type Props = {
  id: string,
  settings: {
    tokenJoinEnabled: boolean,
  },
  resetCommunityJoinToken: Function,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class ResetJoinToken extends React.Component<Props, State> {
  state = { isLoading: false };

  reset = () => {
    this.setState({ isLoading: true });
    return this.props
      .resetCommunityJoinToken({ id: this.props.id })
      .then(() => {
        this.setState({
          isLoading: false,
        });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Link reset!')
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '16px',
        }}
      >
        <OutlineButton
          loading={isLoading}
          onClick={this.reset}
          dataCy="refresh-join-link-token"
        >
          重置这个链接
        </OutlineButton>
      </div>
    );
  }
}

// $FlowFixMe
export default compose(connect(), resetJoinTokenMutation)(ResetJoinToken);
