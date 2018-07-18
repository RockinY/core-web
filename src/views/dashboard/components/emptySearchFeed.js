// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading } from '../style';

const EmptySearchFeed = ({ dispatch, queryString }) => (
  <NullThreadFeed>
    <NullHeading>找不到结果关于 "{queryString}"</NullHeading>
    <Button icon={'post'} onClick={() => dispatch(changeActiveThread('new'))}>
      第一个去回复相关内容吧
    </Button>
  </NullThreadFeed>
);

export default connect()(EmptySearchFeed);
