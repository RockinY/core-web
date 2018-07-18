// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import Link from '../../../components/link';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import Icon from '../../../components/icons';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading, OutlineButton, Hint } from '../style';

const EmptyThreadFeed = ({ dispatch }) => (
  <NullThreadFeed>
    <NullHeading>
      你的社区有点安静，但是请不要担心...
    </NullHeading>
    <NullHeading>我们可以提供一些建议!</NullHeading>
    <Hint>如何更好的管理发展社区!</Hint>
    <Button icon={'post'} onClick={() => dispatch(changeActiveThread('new'))}>
      发布你的第一条话题
    </Button>
    <Hint>找到一些朋友然后愉快的在上面交流!</Hint>
    <Link to={'/explore'}>
      <OutlineButton>
        <Icon glyph="explore" />
        <span>加入更多的社区</span>
      </OutlineButton>
    </Link>
  </NullThreadFeed>
);

export default connect()(EmptyThreadFeed);
