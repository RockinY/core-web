// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import { Notice } from '../../../components/listItems/style';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from '../../../graphql/queries/user/getUserCommunityConnection';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Button, TextButton, OutlineButton } from '../../../components/buttons';
import deleteCurrentUserMutation from '../../../graphql/mutations/user/deleteCurrentUser';
import { SERVER_URL } from '../../../constants';
import Link from '../../../components/link';
import { Loading } from '../../../components/loading';
import type { Dispatch } from 'redux';

type State = {
  isLoading: boolean,
  deleteInited: boolean,
  ownsCommunities: boolean,
};

type Props = {
  isLoading: boolean,
  deleteCurrentUser: Function,
  dispatch: Dispatch<Object>,
  data: {
    user: GetUserCommunityConnectionType,
  },
};

class DeleteAccountForm extends React.Component<Props, State> {
  state = {
    isLoading: false,
    deleteInited: false,
    ownsCommunities: false,
  };

  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (!prevProps.data.user && curr.data.user && curr.data.user.id) {
      if (curr.data.user && curr.data.user.communityConnection) {
        return this.setState({
          ownsCommunities: curr.data.user.communityConnection.edges.some(
            c => c && c.node.communityPermissions.isOwner
          ),
        });
      }
    }
  }

  initDelete = () => {
    this.setState({ deleteInited: true });
  };

  cancelDelete = () => this.setState({ deleteInited: false });

  confirmDelete = () => {
    this.setState({
      isLoading: true,
    });

    this.props
      .deleteCurrentUser()
      .then(() =>
        this.props.dispatch(addToastWithTimeout('success', '账户已删除'))
      )
      .then(() => (window.location.href = `${SERVER_URL}/auth/logout`))
      .catch(err =>
        this.props.dispatch(addToastWithTimeout('error', err.message))
      );
  };

  render() {
    const { isLoading, ownsCommunities, deleteInited } = this.state;
    const { data: { user } } = this.props;

    if (user && user.isPro) {
      return (
        <SectionCard>
          <SectionTitle>删除我的账户</SectionTitle>
          <SectionSubtitle>
            请先取消你的会员身份.
          </SectionSubtitle>
        </SectionCard>
      );
    }

    if (user) {
      return (
        <SectionCard data-cy="delete-account-container">
          <SectionTitle>删除我的账户</SectionTitle>
          <SectionSubtitle>
            你可以随时删除你的账户.{' '}
            <Link to={'/faq'}>了解更多关于账户的删除</Link>.
          </SectionSubtitle>

          {ownsCommunities && (
            <Notice data-cy="owns-communities-notice">
              你现在在云社拥有社区，如果你现在删除你的账户. 这些社区不会被立即删除.
              云社保留继续管理你的社区的权限。
            </Notice>
          )}

          <SectionCardFooter>
            {deleteInited ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                {!isLoading && (
                  <OutlineButton
                    dataCy="delete-account-cancel-button"
                    onClick={this.cancelDelete}
                    style={{ marginBottom: '16px', alignSelf: 'stretch' }}
                  >
                    取消
                  </OutlineButton>
                )}
                <Button
                  dataCy="delete-account-confirm-button"
                  loading={isLoading}
                  disabled={isLoading}
                  gradientTheme={'warn'}
                  onClick={this.confirmDelete}
                >
                  确认删除我的账户
                </Button>
              </div>
            ) : (
              <TextButton
                dataCy="delete-account-init-button"
                color={'warn.default'}
                onClick={this.initDelete}
              >
                删除我的账户
              </TextButton>
            )}
          </SectionCardFooter>
        </SectionCard>
      );
    }

    if (this.props.isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  connect(),
  deleteCurrentUserMutation,
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(DeleteAccountForm);
