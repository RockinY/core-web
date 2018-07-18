// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import type { GetUserType } from '../../../graphql/queries/user/getUser';
import {
  EditDropdownContainer,
  Dropdown,
  DropdownSectionDivider,
  DropdownSection,
  DropdownSectionSubtitle,
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import { Spinner } from '../../../components/globals';
import { openModal } from '../../../actions/modals';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import OutsideClickHandler from '../../../components/outsideClickHandler';
import addCommunityModerator from '../../../graphql/mutations/communityMember/addCommunityModerator';
import removeCommunityModerator from '../../../graphql/mutations/communityMember/removeCommunityModerator';
import blockCommunityMember from '../../../graphql/mutations/communityMember/blockCommunityMember';
import unblockCommunityMember from '../../../graphql/mutations/communityMember/unblockCommunityMember';
import approvePendingCommunityMember from '../../../graphql/mutations/communityMember/approvePendingCommunityMember';
import blockPendingCommunityMember from '../../../graphql/mutations/communityMember/blockPendingCommunityMember';
import type { GetCommunitySettingsType } from '../../../graphql/queries/community/getCommunitySettings';
import MutationWrapper from './mutationWrapper';
import type { Dispatch } from 'redux';

type Props = {
  blockCommunityMember: Function,
  unblockCommunityMember: Function,
  addCommunityModerator: Function,
  removeCommunityModerator: Function,
  approvePendingCommunityMember: Function,
  blockPendingCommunityMember: Function,
  dispatch: Function,
  dispatch: Dispatch<Object>,
  community: GetCommunitySettingsType,
  history: Object,
  user: {
    ...$Exact<GetUserType>,
  },
  permissions: {
    isMember: boolean,
    isBlocked: boolean,
    isModerator: boolean,
    isOwner: boolean,
  },
};

type State = { isOpen: boolean };

class EditDropdown extends React.Component<Props, State> {
  initialState = { isOpen: false };

  state = this.initialState;

  input = {
    communityId: this.props.community.id,
    userId: this.props.user.id,
  };

  permissionConfigurations = {
    owner: {
      id: 'owner',
      title: '拥有者',
      subtitle: '能够管理所有成员，团队和各种内容',
      selected: false,
    },
    moderator: {
      id: 'moderator',
      title: this.props.community.hasChargeableSource
        ? '团队成员 · ¥10/每月'
        : '团队成员',
      subtitle:
        '社区里面高亮显示，同时可以管理社区内容',
      selected: false,
    },
    blocked: {
      id: 'blocked',
      title: '被屏蔽',
      subtitle:
        '无法开始或者加入对话，同时不会收到任何通知',
      selected: false,
    },
    member: {
      id: 'member',
      title: '成员',
      subtitle:
        "可以开始或者加入任何人的对话中",
      selected: false,
    },
    approvePendingMember: {
      id: 'approvePending',
      title: '通过',
      subtitle: '允许这个人加入您的社区',
      selected: false,
    },
    blockPendingMember: {
      id: 'blockPending',
      title: '屏蔽',
      subtitle:
        '屏蔽这个用户对该社区的申请',
      selected: false,
    },
  };

  initMessage = () => {
    this.props.dispatch(initNewThreadWithUser(this.props.user));
    return this.props.history.push('/messages/new');
  };

  getRolesConfiguration = () => {
    const { permissions, community } = this.props;

    if (permissions.isOwner) {
      return [
        {
          ...this.permissionConfigurations.owner,
          selected: true,
        },
      ];
    }

    if (permissions.isModerator) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: null,
          selected: true,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: this.props.removeCommunityModerator,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: this.props.blockCommunityMember,
        },
      ];
    }

    if (permissions.isMember) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: community.hasChargeableSource
            ? this.props.addCommunityModerator
            : null,
          onClick: this.initUpgrade,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: null,
          selected: true,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: this.props.blockCommunityMember,
        },
      ];
    }

    if (permissions.isBlocked) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: community.hasChargeableSource
            ? this.props.addCommunityModerator
            : null,
          onClick: this.initUpgrade,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: this.props.unblockCommunityMember,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: null,
          selected: true,
        },
      ];
    }

    // $FlowFixMe
    if (permissions.isPending) {
      return [
        {
          ...this.permissionConfigurations.approvePendingMember,
          mutation: this.props.approvePendingCommunityMember,
        },
        {
          ...this.permissionConfigurations.blockPendingMember,
          mutation: this.props.blockPendingCommunityMember,
        },
      ];
    }
  };

  toggleOpen = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  initUpgrade = () => {
    if (!this.props.community.billingSettings.administratorEmail) {
      return this.props.dispatch(
        openModal('ADMIN_EMAIL_ADDRESS_VERIFICATION_MODAL', {
          id: this.props.community.id,
        })
      );
    }

    return this.props.dispatch(
      openModal('UPGRADE_MODERATOR_SEAT_MODAL', {
        input: this.input,
        community: this.props.community,
      })
    );
  };

  render() {
    const { isOpen } = this.state;
    const configuration = this.getRolesConfiguration();

    return (
      <EditDropdownContainer data-cy="community-settings-member-edit-dropdown-trigger">
        <Icon onClick={this.toggleOpen} isOpen={isOpen} glyph={'settings'} />

        {isOpen && (
          <OutsideClickHandler onOutsideClick={this.close}>
            <Dropdown>
              <DropdownSection
                style={{ borderBottom: '0' }}
                onClick={this.initMessage}
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

              {configuration &&
                configuration.map((role, i) => {
                  return role.mutation ? (
                    <MutationWrapper
                      key={i}
                      mutation={role.mutation && role.mutation}
                      variables={{ input: this.input }}
                      render={({ isLoading }) => (
                        <DropdownSection>
                          <DropdownAction>
                            {isLoading ? (
                              <Spinner size={20} />
                            ) : (
                              <Icon
                                glyph={role.selected ? 'checkmark' : 'checkbox'}
                                size={'32'}
                              />
                            )}
                          </DropdownAction>

                          <DropdownSectionText>
                            <DropdownSectionTitle>
                              {role.title}
                            </DropdownSectionTitle>
                            <DropdownSectionSubtitle>
                              {role.subtitle}
                            </DropdownSectionSubtitle>
                          </DropdownSectionText>
                        </DropdownSection>
                      )}
                    />
                  ) : (
                    // $FlowFixMe
                    <DropdownSection key={i} onClick={role.onClick}>
                      <DropdownAction>
                        <Icon
                          glyph={role.selected ? 'checkmark' : 'checkbox'}
                          size={'32'}
                        />
                      </DropdownAction>

                      <DropdownSectionText>
                        <DropdownSectionTitle>
                          {role.title}
                        </DropdownSectionTitle>
                        <DropdownSectionSubtitle>
                          {role.subtitle}
                        </DropdownSectionSubtitle>
                      </DropdownSectionText>
                    </DropdownSection>
                  );
                })}
            </Dropdown>
          </OutsideClickHandler>
        )}
      </EditDropdownContainer>
    );
  }
}

export default compose(
  connect(),
  withRouter,
  addCommunityModerator,
  removeCommunityModerator,
  blockCommunityMember,
  unblockCommunityMember,
  approvePendingCommunityMember,
  // $FlowFixMe
  blockPendingCommunityMember
)(EditDropdown);
