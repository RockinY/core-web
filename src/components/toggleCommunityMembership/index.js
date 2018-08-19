// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import addCommunityMemberMutation from '../../graphql/mutations/communityMember/addCommunityMember';
import removeCommunityMemberMutation from '../../graphql/mutations/communityMember/removeCommunityMember';
import type { GetCommunityType } from '../../graphql/queries/community/getCommunity';
import { addToastWithTimeout } from '../../actions/toasts';
import type { AddCommunityMemberType } from '../../graphql/mutations/communityMember/addCommunityMember';
import type { RemoveCommunityMemberType } from '../../graphql/mutations/communityMember/removeCommunityMember';
import type { Dispatch } from 'redux';

type Props = {
  community: {
    ...$Exact<GetCommunityType>,
  },
  removeCommunityMember: Function,
  addCommunityMember: Function,
  dispatch: Dispatch<Object>,
  render: Function,
  onJoin?: Function,
  onLeave?: Function,
};

type State = { isLoading: boolean };

class ToggleCommunityMembership extends React.Component<Props, State> {
  state = { isLoading: false };

  init = () => {
    const { community } = this.props;

    const action = community.communityPermissions.isMember
      ? this.removeMember
      : this.addMember;

    const input = { communityId: community.id };

    this.setState({
      isLoading: true,
    });

    return action(input);
  };

  terminate = () => {
    this.setState({
      isLoading: false,
    });
  };

  removeMember = input => {
    const { community } = this.props;
    return this.props
      .removeCommunityMember({ input })
      .then(({ data }: RemoveCommunityMemberType) => {
        this.props.dispatch(
          addToastWithTimeout('neutral', `离开了${community.name}.`)
        );

        this.props.onLeave && this.props.onLeave(data.removeCommunityMember);

        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        return this.terminate();
      });
  };

  addMember = input => {
    const { community } = this.props;
    return this.props
      .addCommunityMember({ input })
      .then(({ data }: AddCommunityMemberType) => {
        this.props.dispatch(
          addToastWithTimeout(
            'success',
            `成功加入社区 ${community.name}!`
          )
        );

        this.props.onJoin && this.props.onJoin(data.addCommunityMember);

        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        return this.terminate();
      });
  };

  render() {
    return (
      <div className={'member-button'} onClick={this.init}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

export default compose(
  connect(),
  addCommunityMemberMutation,
  // $FlowFixMe
  removeCommunityMemberMutation
)(ToggleCommunityMembership);
