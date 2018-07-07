// @flow
import * as React from 'react';
import Icon from '../../components/icons';

import {
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