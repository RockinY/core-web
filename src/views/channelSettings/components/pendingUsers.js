//@flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserListItemContainer } from '../style';
import GranularUserProfile from '../../../components/granularUserProfile';
import { Loading } from '../../../components/loading';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import getPendingUsersQuery from '../../../graphql/queries/channel/getChannelPendingUsers';
import type { GetChannelPendingUsersType } from '../../../graphql/queries/channel/getChannelPendingUsers';
import ViewError from '../../../components/viewError';
import { ListContainer } from '../../../components/listItems/style';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from '../../../components/settingsViews/style';
import EditDropdown from './editDropdown';
import {
  Dropdown,
  DropdownSectionDivider,
  DropdownSection,
  DropdownSectionSubtitle,
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';

type Props = {
  data: {
    channel: GetChannelPendingUsersType,
  },
  togglePending: Function,
  isLoading: boolean,
  initMessage: Function,
  currentUser: ?Object,
};

class PendingUsers extends React.Component<Props> {
  render() {
    const {
      data,
      isLoading,
      currentUser,
      togglePending,
      initMessage,
    } = this.props;

    if (data && data.channel) {
      const { pendingUsers } = data.channel;

      return (
        <SectionCard>
          <SectionTitle>等待成员</SectionTitle>
          {pendingUsers &&
            pendingUsers.length > 0 && (
              <SectionSubtitle>
                通过用户的请求会允许用户浏览频道下面所有的话题和消息，同时也会允许他们在上面
                发表他们自己的话题
              </SectionSubtitle>
            )}

          <ListContainer>
            {pendingUsers &&
              pendingUsers.map(user => {
                if (!user) return null;
                return (
                  <UserListItemContainer key={user.id}>
                    <GranularUserProfile
                      userObject={user}
                      id={user.id}
                      name={user.name}
                      username={user.username}
                      isCurrentUser={currentUser && user.id === currentUser.id}
                      isOnline={user.isOnline}
                      onlineSize={'small'}
                      profilePhoto={user.profilePhoto}
                      avatarSize={'32'}
                      description={user.description}
                    >
                      <EditDropdown
                        render={() => (
                          <Dropdown>
                            <DropdownSection
                              style={{ borderBottom: '0' }}
                              onClick={() => initMessage(user)}
                            >
                              <DropdownAction>
                                <Icon glyph={'message'} size={'32'} />
                              </DropdownAction>
                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  直接发送消息
                                </DropdownSectionTitle>
                              </DropdownSectionText>
                            </DropdownSection>

                            <DropdownSectionDivider />

                            <DropdownSection
                              onClick={() => togglePending(user.id, 'approve')}
                            >
                              <DropdownAction>
                                <Icon glyph={'plus'} size={'32'} />
                              </DropdownAction>

                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  通过
                                </DropdownSectionTitle>
                                <DropdownSectionSubtitle>
                                  这个用户将可以浏览频道下的所有对话
                                </DropdownSectionSubtitle>
                              </DropdownSectionText>
                            </DropdownSection>

                            <DropdownSection
                              onClick={() =>
                                user && togglePending(user.id, 'block')
                              }
                            >
                              <DropdownAction>
                                <Icon glyph={'minus'} size={'32'} />
                              </DropdownAction>

                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  屏蔽
                                </DropdownSectionTitle>
                                <DropdownSectionSubtitle>
                                  屏蔽用户对这个频道的加入申请
                                </DropdownSectionSubtitle>
                              </DropdownSectionText>
                            </DropdownSection>
                          </Dropdown>
                        )}
                      />
                    </GranularUserProfile>
                  </UserListItemContainer>
                );
              })}

            {pendingUsers &&
              pendingUsers.length <= 0 && (
                <SectionSubtitle>
                  There are no pending requests to join this channel.
                </SectionSubtitle>
              )}
          </ListContainer>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError />
      </SectionCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  getPendingUsersQuery,
  viewNetworkHandler
)(PendingUsers);
