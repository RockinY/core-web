// @flow
import * as React from 'react';
import {
  Footer,
  FooterGrid,
  Masthead,
  Support,
  Safety,
  License
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
      <License>
        <span>©2018 南京酷猿信息技术有限公司 · <a href="http://www.miitbeian.gov.cn" target="_blank">苏ICP备18033476号-1</a></span>
      </License>
    </Footer>
  );
};
