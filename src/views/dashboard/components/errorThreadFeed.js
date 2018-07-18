import React from 'react';
// $FlowFixMe
import Link from '../../../components/link';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading } from '../style';

export default props => (
  <NullThreadFeed>
    <NullHeading>
      话题加载出错了，请尝试刷新一下页面.
    </NullHeading>

    <Button>
      <Link to={'/'}>刷新</Link>
    </Button>
  </NullThreadFeed>
);
