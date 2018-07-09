// @flow
//
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import addCommunityMemberWithTokenMutation from '../../graphql/mutations/communityMember/addCommunityMemberWithToken';
import { addToastWithTimeout } from '../../actions/toasts';
import CommunityLogin from '../communityLogin';
import AppViewWrapper from '../../components/appViewWrapper';
import { Loading } from '../../components/loading';
import { CLIENT_URL } from '../../constants';

type Props = {
  match: Object,
  location: Object,
  history: Object,
  addCommunityMemberWithToken: Function,
  currentUser: Object,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class PrivateCommunityJoin extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    const { match, history, currentUser } = this.props;
    const { token, communitySlug } = match.params;

    if (!token) {
      return history.push(`/${communitySlug}`);
    }

    if (!currentUser) {
      return;
    }

    return this.handleJoin();
  }

  componentDidUpdate(prevProps) {
    const curr = this.props;

    if (!prevProps.currentUser && curr.currentUser) {
      return this.handleJoin();
    }
  }

  handleJoin = () => {
    const {
      match,
      history,
      addCommunityMemberWithToken,
      dispatch,
    } = this.props;
    const { token, communitySlug } = match.params;

    this.setState({ isLoading: true });

    addCommunityMemberWithToken({ communitySlug, token })
      .then(data => {
        this.setState({ isLoading: false });
        dispatch(addToastWithTimeout('success', 'Welcome!'));
        return history.push(`/${communitySlug}`);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        dispatch(addToastWithTimeout('error', err.message));
        return history.push(`/${communitySlug}`);
      });
  };

  render() {
    const { currentUser, match } = this.props;
    const { isLoading } = this.state;

    const { params: { communitySlug, token } } = match;

    const redirectPath = `${CLIENT_URL}/${communitySlug}/join/${token}`;

    if (!currentUser || !currentUser.id) {
      return <CommunityLogin match={match} redirectPath={redirectPath} />;
    }

    if (isLoading) {
      return (
        <AppViewWrapper>
          <Loading />
        </AppViewWrapper>
      );
    }

    return null;
  }
}

const map = state => ({ currentUser: state.users.currentUser });
// $FlowIssue
export default compose(connect(map), addCommunityMemberWithTokenMutation)(
  PrivateCommunityJoin
);
