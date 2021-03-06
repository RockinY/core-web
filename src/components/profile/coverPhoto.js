import React from 'react';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import Link from '../link';
import { ProfileHeaderAction } from './style';
import { optimize } from '../../utils/images'

const PhotoContainer = styled.div`
  grid-area: cover;
  position: relative;
  width: 100%;
  flex: 0 0 ${props => (props.large ? '320px' : '96px')};
  background-color: ${({ theme }) => theme.bg.reverse};
  background-image: ${props =>
    props.coverURL
      ? `url("${optimize(props.coverURL)}")`
      : 'none'};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${props => (props.large ? '0' : '12px 12px 0 0')};

  @media (max-width: 768px) {
    flex: 0 0 ${props => (props.large ? '160px' : '64px')};
    border-radius: 0;
  }
`;

const CoverAction = styled(ProfileHeaderAction)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

export const CoverPhoto = (props: Object) => {
  if (props.user) {
    return (
      <PhotoContainer coverURL={props.user.coverPhoto}>
        {props.currentUser && props.currentUser.id === props.user.id ? (
          <Link to={`../users/${props.user.username}/settings`}>
            <CoverAction
              glyph="settings"
              color="text.reverse"
              opacity="0.5"
              hoverColor="text.reverse"
              tipText={`修改`}
              tipLocation={'left'}
            />
          </Link>
        ) : props.currentUser ? (
          <CoverAction
            glyph="message-fill"
            color="text.reverse"
            hoverColor="text.reverse"
            onClick={props.onClick}
            tipText={`给${props.user.name}发送消息`}
            tipLocation={'left'}
          />
        ) : null}
        {props.children}
      </PhotoContainer>
    );
  } else {
    return (
      <PhotoContainer large coverURL={props.src}>
        {props.children}
      </PhotoContainer>
    );
  }
};
