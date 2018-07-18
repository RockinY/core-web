// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserListItemContainer } from '../style';
import GranularUserProfile from '../../../components/granularUserProfile';
import { Loading } from '../../../components/loading';
import getBlockedUsersQuery from '../../../graphql/queries/channel/getChannelBlockedUsers';
import type { GetChannelBlockedUsersType } from '../../../graphql/queries/channel/getChannelBlockedUsers';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from '../../../components/settingsViews/style';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import { ListContainer, Notice } from '../../../components/listItems/style';
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
    channel: GetChannelBlockedUsersType,
  },
  unblock: Function,
  isLoading: boolean,
  initMessage: Function,
  currentUser: ?Object,
};

class BlockedUsers extends React.Component<Props> {
  render() {
    const { data, isLoading, currentUser, unblock, initMessage } = this.props;

    if (data && data.channel) {
      const { blockedUsers } = data.channel;

      return (
        <SectionCard>
          <SectionTitle>屏蔽用户</SectionTitle>
          {blockedUsers &&
            blockedUsers.length > 0 && (
              <SectionSubtitle>
                被屏蔽的用户将无法看到这个频道下面的话题和消息. TA们仍然可以加入
                其他的公共社区和私人社区.
              </SectionSubtitle>
            )}

          {blockedUsers &&
            blockedUsers.length > 0 && (
              <Notice>
                取消用户的并<b>不会</b>自动让他们加入这个频道. 但是他们将可以再次发出加入
                这个频道的申请只要这个频道仍然是私有的.
              </Notice>
            )}

          <ListContainer>
            {blockedUsers &&
              blockedUsers.map(user => {
                if (!user || !user.id) return null;

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
                                  直接发送信息
                                </DropdownSectionTitle>
                              </DropdownSectionText>
                            </DropdownSection>

                            <DropdownSectionDivider />

                            <DropdownSection onClick={() => unblock(user.id)}>
                              <DropdownAction>
                                <Icon glyph={'minus'} size={'32'} />
                              </DropdownAction>

                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  取消屏蔽
                                </DropdownSectionTitle>
                                <DropdownSectionSubtitle>
                                  允许其再次申请加入
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

            {blockedUsers &&
              blockedUsers.length <= 0 && (
                <SectionSubtitle>
                  这个频道下面没有被屏蔽的用户
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
  getBlockedUsersQuery,
  viewNetworkHandler
)(BlockedUsers);
