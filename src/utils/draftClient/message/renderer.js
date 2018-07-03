// @flow
import React from 'react';
import mentionsDecorator from '../mentionsDecorator';
import linksDecorator from '../linksDecorator';
import { Line, Paragraph } from '../../../components/message/style';
import type { Node } from 'react';
import type { KeyObj, KeysObj } from './types';

const messageRenderer = {
  inline: {
    BOLD: (children: Array<Node>, { key }: KeyObj) => (
      <span style={{ fontWeight: 700 }} key={key}>
        {children}
      </span>
    ),
    ITALIC: (children: Array<Node>, { key }: KeyObj) => (
      <em key={key}>{children}</em>
    ),
    CODE: (children: Array<Node>, { key }: KeyObj) => (
      <code key={key}>{children}</code>
    ),
  },
  blocks: {
    unstyled: (children: Array<Node>, { keys }: KeysObj) =>
      // $FlowFixMe
      children.map((child, index) => (
        <Paragraph key={keys[index] || index}>{child}</Paragraph>
      )),
    'code-block': (children: Array<Node>, { keys }: KeysObj) => (
      <Line key={keys.join('|')}>
        {children.map((child, i) => [child, <br key={i} />])}
      </Line>
    ),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export { messageRenderer };
