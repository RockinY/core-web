// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Link from '../../../components/link';
import { LikeButton } from '../../../components/threadLikes';
import { convertTimestampToDate } from '../../../utils/timeFormatting';
import { Button } from '../../../components/buttons';
import toggleChannelSubscriptionMutation from '../../../graphql/mutations/channel/toggleChannelSubscription';
import type { GetThreadType } from '../../../graphql/queries/thread/getThread';
import { addToastWithTimeout } from '../../../actions/toasts';
import Avatar from '../../../components/avatar';
import type { Dispatch } from 'redux';
import {
  CommunityHeader,
  CommunityHeaderName,
  CommunityHeaderLink,
  CommunityHeaderMeta,
  CommunityHeaderSubtitle,
  CommunityHeaderMetaCol,
  AnimatedContainer,
} from '../style';

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000'

type Props = {
  dispatch: Dispatch<Object>,
  toggleChannelSubscription: Function,
  currentUser: Object,
  hide: boolean,
  watercooler: boolean,
  thread: GetThreadType,
  isVisible: boolean,
  forceScrollToTop: Function,
};
type State = {
  isLoading: boolean,
};
class ThreadCommunityBanner extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = { isLoading: false };
  }

  joinChannel = () => {
    const {
      thread: { channel },
      dispatch,
      toggleChannelSubscription,
    } = this.props;

    this.setState({
      isLoading: true,
    });

    toggleChannelSubscription({ channelId: channel.id })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const {
          isMember,
          isPending,
        } = toggleChannelSubscription.channelPermissions;

        let str = '';
        if (isPending) {
          str = `Your request to join the ${
            toggleChannelSubscription.name
          } channel in ${
            toggleChannelSubscription.community.name
          } has been sent.`;
        }

        if (!isPending && isMember) {
          str = `Joined the ${
            toggleChannelSubscription.community.name
          } community!`;
        }

        if (!isPending && !isMember) {
          str = `Left the channel ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        return dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      thread: { channel, community, watercooler, id },
      thread,
      currentUser,
      isVisible,
      forceScrollToTop,
    } = this.props;
    const { isLoading } = this.state;

    const loginUrl = community.brandedLogin.isEnabled
      ? `/${community.slug}/login?r=${CLIENT_URL}/thread/${id}`
      : `/login?r=${CLIENT_URL}/${community.slug}/thread/${id}`;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);

    return (
      <AnimatedContainer isVisible={isVisible}>
        <CommunityHeader>
          <CommunityHeaderMeta>
            <CommunityHeaderLink to={`/${community.slug}`}>
              <Avatar src={community.profilePhoto} community size={'32'} />
            </CommunityHeaderLink>
            <CommunityHeaderMetaCol>
              <CommunityHeaderName onClick={forceScrollToTop}>
                {watercooler
                  ? `${community.name} watercooler`
                  : thread.content.title}
              </CommunityHeaderName>
              <CommunityHeaderSubtitle>
                <Link to={`/${community.slug}`}>{community.name}</Link>
                {channel.slug !== 'general' && <span>/</span>}
                {channel.slug !== 'general' && (
                  <Link to={`/${community.slug}/${channel.slug}`}>
                    {channel.name}
                  </Link>
                )}
                <span>{` · ${timestamp}`}</span>
              </CommunityHeaderSubtitle>
            </CommunityHeaderMetaCol>
          </CommunityHeaderMeta>

          {channel.channelPermissions.isMember ? (
            <LikeButton thread={thread} />
          ) : currentUser ? (
            <Button
              gradientTheme={'success'}
              onClick={this.joinChannel}
              loading={isLoading}
            >
              Join channel
            </Button>
          ) : (
            <Link to={loginUrl}>
              <Button gradientTheme={'success'}>Join Community</Button>
            </Link>
          )}
        </CommunityHeader>
      </AnimatedContainer>
    );
  }
}
const map = state => ({ currentUser: state.users.currentUser });
// $FlowIssue
export default compose(connect(map), toggleChannelSubscriptionMutation)(
  ThreadCommunityBanner
);