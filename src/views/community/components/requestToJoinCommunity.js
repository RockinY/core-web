// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import addPendingCommunityMemberMutation from '../../../graphql/mutations/communityMember/addPendingCommunityMember';
import removePendingCommunityMemberMutation from '../../../graphql/mutations/communityMember/removePendingCommunityMember';
import type { GetCommunityType } from '../../../graphql/queries/community/getCommunity';
import { addToastWithTimeout } from '../../../actions/toasts';
import { Button, OutlineButton } from '../../../components/buttons';

type Props = {
  community: GetCommunityType,
  addPendingCommunityMember: Function,
  removePendingCommunityMember: Function,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class RequestToJoinCommunity extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  sendRequest = () => {
    const { dispatch, community } = this.props;
    const { id: communityId } = community;

    this.setState({
      isLoading: true,
    });

    this.props
      .addPendingCommunityMember({ input: { communityId } })
      .then(() => {
        this.setState({
          isLoading: false,
        });

        return dispatch(addToastWithTimeout('success', '请求已发送!'));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  cancelRequest = () => {
    const { dispatch, community } = this.props;
    const { id: communityId } = community;

    this.setState({
      isLoading: true,
    });

    this.props
      .removePendingCommunityMember({ input: { communityId } })
      .then(() => {
        this.setState({
          isLoading: false,
        });

        return dispatch(
          addToastWithTimeout('success', '请求已被取消')
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { community } = this.props;
    const { isLoading } = this.state;

    const { isPending } = community.communityPermissions;

    return (
      <React.Fragment>
        {isPending && (
          <OutlineButton
            large
            onClick={this.cancelRequest}
            icon="minus"
            loading={isLoading}
            data-cy="cancel-request-to-join-private-community-button"
          >
            取消请求
          </OutlineButton>
        )}

        {!isPending && (
          <Button
            large
            onClick={this.sendRequest}
            icon="private-unlocked"
            loading={isLoading}
            data-cy="request-to-join-private-community-button"
          >
            请求加入社区 - {community.name}
          </Button>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  connect(),
  addPendingCommunityMemberMutation,
  // $FlowFixMe
  removePendingCommunityMemberMutation
)(RequestToJoinCommunity);
