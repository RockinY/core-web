// @flow
import React from 'react';
import styled from 'styled-components';
import Link from '../../../components/link';
import Dropdown from '../../../components/dropdown';
import { openModal } from '../../../actions/modals';
import { SERVER_URL } from '../../../constants';
import Badge from '../../../components/badges';
import { connect } from 'react-redux';

const UserProfileDropdown = styled(Dropdown)`
  width: 200px;
`;

const UserProfileDropdownList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const UserProfileDropdownListItem = styled.li`
  font-size: 14px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  border-bottom: 2px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.text.default};
    background: ${props => props.theme.bg.wash};
  }
`;

type ProfileProps = Object;

const ProfileDropdown = (props: ProfileProps) => {
  return (
    <UserProfileDropdown className={'dropdown'}>
      <UserProfileDropdownList>
        {props.user.username && (
          <Link rel="nofollow" to={`/users/${props.user.username}/settings`}>
            <UserProfileDropdownListItem>
              设置
            </UserProfileDropdownListItem>
          </Link>
        )}
        {props.user && !props.user.isPro && (
          <UserProfileDropdownListItem
            onClick={() =>
              props.dispatch(openModal('UPGRADE_MODAL', { user: props.user }))
            }
          >
            升级为<Badge type="pro" />
          </UserProfileDropdownListItem>
        )}
        <Link to={`/about`}>
          <UserProfileDropdownListItem>
            云社
          </UserProfileDropdownListItem>
        </Link>
        <Link to={`/support`}>
          <UserProfileDropdownListItem>帮助</UserProfileDropdownListItem>
        </Link>

        <a href={`${SERVER_URL}/auth/logout`}>
          <UserProfileDropdownListItem>登出</UserProfileDropdownListItem>
        </a>
      </UserProfileDropdownList>
    </UserProfileDropdown>
  );
};

export default connect()(ProfileDropdown);
