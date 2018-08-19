// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../actions/toasts';
import type { GetChannelType } from '../../graphql/queries/channel/getChannel';
import toggleChannelSubscriptionMutation from '../../graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from '../../graphql/mutations/channel/toggleChannelSubscription';
import type { Dispatch } from 'redux';

type Props = {
  channel: {
    ...$Exact<GetChannelType>,
  },
  toggleSubscription: Function,
  dispatch: Dispatch<Object>,
  render: Function,
  onJoin?: Function,
  onLeave?: Function,
  toggleChannelSubscription: Function,
};

type State = { isLoading: boolean };

class ToggleChannelMembership extends React.Component<Props, State> {
  state = { isLoading: false };

  init = () => {
    this.setState({
      isLoading: true,
    });

    return this.toggleSubscription();
  };

  terminate = () => {
    this.setState({
      isLoading: false,
    });
  };

  toggleSubscription = () => {
    const { channel } = this.props;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId: channel.id })
      .then(({ data }: ToggleChannelSubscriptionType) => {
        this.setState({
          isLoading: false,
        });

        const { toggleChannelSubscription } = data;

        const isMember = toggleChannelSubscription.channelPermissions.isMember;
        const isPending =
          toggleChannelSubscription.channelPermissions.isPending;
        let str = '';
        if (isPending) {
          str = `请求加入社区${toggleChannelSubscription.community.name}的${toggleChannelSubscription.name}频道`;
        }

        if (!isPending && isMember) {
          str = `加入了社区${toggleChannelSubscription.community.name}的${toggleChannelSubscription.name}频道`;
        }

        if (!isPending && !isMember) {
          str = `离开了社区${toggleChannelSubscription.community.name}的${toggleChannelSubscription.name}频道`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        this.props.dispatch(addToastWithTimeout(type, str));
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    return <div onClick={this.init}>{this.props.render(this.state)}</div>;
  }
}

// $FlowFixMe
export default compose(connect(), toggleChannelSubscriptionMutation)(
  ToggleChannelMembership
);
