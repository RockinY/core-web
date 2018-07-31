// @flow
import * as React from 'react';
import {
  Footer,
  FooterGrid,
  Masthead,
  Support,
  Safety
} from '../style';
import Link from '../../../components/link';
import { Logo } from '../../../components/logo';

export default () => {
  return (
    <Footer>
      <FooterGrid>
        <Masthead>
          <Link to="/">
            <Logo />
          </Link>
          <span>苏ICP备18033476号-1</span>
        </Masthead>
        <Support>
          <span>服务</span>
          <Link to={`/yunshe`}>加入社区</Link>
          <a href="mailto:lby89757@hotmai.com">发送邮件</a>
        </Support>
        <Safety>
          <span>条约</span>
          <Link to="/privacy">隐私政策</Link>
          <Link to="/terms">服务条款</Link>
        </Safety>
      </FooterGrid>
    </Footer>
  );
};
