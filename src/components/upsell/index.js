// @flow
import * as React from 'react';
import Icon from '../../components/icons';
import { Button, OutlineButton } from '../buttons';
import Link from '../link';

import {
  Actions,
  Title,
  Subtitle,
  NullCol,
  LargeEmoji,
  MiniTitle,
  MiniSubtitle
} from './style';

type NullCardProps = {
  noShadow?: boolean,
  noPadding?: boolean,
  bg?: ?string,
  heading?: string,
  copy?: string,
  children?: React.Node,
  repeat?: boolean,
  emoji?: string,
};
export const NullCard = (props: NullCardProps) => {
  return (
    <NullCol bg={props.bg} repeat={props.repeat} noPadding={props.noPadding}>
      {props.heading && <Title>{props.heading}</Title>}
      {props.copy && <Subtitle>{props.copy}</Subtitle>}
      {props.children}
    </NullCol>
  );
};

type NullStateProps = {
  bg?: ?string,
  heading?: string,
  copy?: string,
  icon?: string,
  children?: React.Node,
};
export const NullState = (props: NullStateProps) => (
  <NullCol bg={props.bg}>
    {props.icon && <Icon glyph={props.icon} size={64} />}
    {props.heading && <Title>{props.heading}</Title>}
    {props.copy && <Subtitle>{props.copy}</Subtitle>}
    {props.children}
  </NullCol>
);

export const MiniNullCard = (props: NullCardProps) => {
  return (
    <NullCol bg={props.bg} repeat={props.repeat} noPadding={props.noPadding}>
      {props.emoji && (
        <LargeEmoji>
          <span role="img" aria-label="Howdy!">
            {props.emoji}
          </span>
        </LargeEmoji>
      )}
      {props.heading && <MiniTitle>{props.heading}</MiniTitle>}
      {props.copy && <MiniSubtitle>{props.copy}</MiniSubtitle>}
      {props.children}
    </NullCol>
  );
};

export const UpsellCreateCommunity = ({ close }: { close: Function }) => {
  const title = '创建一个新的社区';
  const subtitle = '在云社创建您得专属社区，社区将永远免费!';

  return (
    <NullCard bg={'onboarding'}>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Actions>
        <Link to="/new/community">
          <Button onClick={close}>开始探索</Button>
        </Link>
      </Actions>
    </NullCard>
  );
};

export const Upsell404Channel = ({ community }: { community: string }) => {
  return (
    <Actions>
      <Link to={`/${community}`}>
        <Button large>返回</Button>
      </Link>
    </Actions>
  );
};

export const Upsell404Community = () => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a community. In this case, we will return
  // them to the community view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the community doesn't exists (404) so
  // we should return the user back to homepage
  return (
    <Actions>
      <Link to={'/'}>
        <OutlineButton large>返回</OutlineButton>
      </Link>

      <Link to={'/new/community'}>
        <Button large>创建一个新的社区</Button>
      </Link>
    </Actions>
  );
};

type TeamMemberProps = {
  communitySlug: string,
  small?: boolean,
};

export const UpsellTeamMembers = (props: TeamMemberProps) => {
  return (
    <MiniNullCard
      copy={
        props.small ? '' : "您的社区还没有任何成员!"
      }
      noPadding
      alignItems="flex-end"
    >
      <Link to={`/${props.communitySlug}/settings/members`}>
        <OutlineButton icon={props.small ? null : 'member-add'}>
          添加 {props.small ? '更多' : ''} 社区成员
        </OutlineButton>
      </Link>
    </MiniNullCard>
  );
};

export const UpsellNullNotifications = () => {
  return (
    <NullCard bg="notification" heading="你还没有收到任何通知.">
      <Link to="/">
        <Button icon="home">返回</Button>
      </Link>
    </NullCard>
  );
};