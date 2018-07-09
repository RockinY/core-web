// @flow
import * as React from 'react';
import Icon from '../../components/icons';
import { Button } from '../buttons';
import Link from '../link';

import {
  Actions,
  Title,
  Subtitle,
  NullCol
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

export const UpsellCreateCommunity = ({ close }: { close: Function }) => {
  const title = 'Create a community';
  const subtitle = 'Building communities on Spectrum is easy and free forever';

  return (
    <NullCard bg={'onboarding'}>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Actions>
        <Link to="/new/community">
          <Button onClick={close}>Get Started</Button>
        </Link>
      </Actions>
    </NullCard>
  );
};

export const Upsell404Channel = ({ community }: { community: string }) => {
  return (
    <Actions>
      <Link to={`/${community}`}>
        <Button large>Take me back</Button>
      </Link>
    </Actions>
  );
};