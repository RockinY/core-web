// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import Section from '../../../components/themedSection';
import { Wrapper } from '../style';
import Link from '../../../components/link';
import { Button } from '../../../components/buttons';
import {
  FourUp,
  Heading,
  Copy,
  PlanSection,
  PlanPrice,
  PlanDescription,
} from '../pricing/style';

class Support extends React.Component<{}> {
  render() {
    return (
      <Wrapper data-cy="support-page">
        <Section color={'bg.reverse'}>
          <FourUp>
            <div style={{ gridArea: 'copy' }}>
              <Heading>有什么能够帮助到您的吗？</Heading>

              <Copy>
                对我们的产品有建议反馈，或者纯粹只是想联系我们，下面有你想要的信息
              </Copy>
            </div>
            <PlanSection style={{ gridArea: 'one' }}>
              <div>
                <PlanPrice>产品使用问题?</PlanPrice>
                <PlanDescription>
                  加入云社的八阿哥频道，在那里汇报你所遇到的问题，一般很快我们就会给你答复的.
                </PlanDescription>
              </div>

              <Link to={'/yunshe'}>
                <Button
                  gradientTheme={'warn'}
                  icon={'bug'}
                >
                  发现新问题
                </Button>
              </Link>
            </PlanSection>

            <PlanSection style={{ gridArea: 'two' }}>
              <div>
                <PlanPrice>有新的想法?</PlanPrice>
                <PlanDescription>
                  产品还不够理想，或者有新的需求想提出来，加入我们的新需求频道吧，我们非常欢迎你的任何意见。
                </PlanDescription>
              </div>

              <Link to={'/yunshe'}>
                <Button
                  gradientTheme={'space'}
                  icon={'idea'}
                >
                  提出新需求
                </Button>
              </Link>
            </PlanSection>

            <PlanSection style={{ gridArea: 'three' }}>
              <div>
                <PlanPrice>了解我们的最新动态</PlanPrice>
                <PlanDescription>
                  我们会不定期的在官方频道下面发布最新开发动态及技术分享，加入我们的社区来支持我们吧
                </PlanDescription>
              </div>

              <Link to={'/yunshe'}>
                <Button
                  gradientTheme={'brand'}
                  icon={'support'}
                >
                  加入云社区
                </Button>
              </Link>
            </PlanSection>

            <PlanSection style={{ gridArea: 'four' }}>
              <div>
                <PlanPrice>邮件通知我们</PlanPrice>
                <PlanDescription>
                  还有其他问题想更直接的接触我们的话，您可以给我们直接发送邮件
                </PlanDescription>
              </div>

              <a href={'mailto:hi@corran.cn'}>
                <Button
                  gradientTheme={'special'}
                  icon={'email'}
                >
                  给我发邮件
                </Button>
              </a>
            </PlanSection>
          </FourUp>
        </Section>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
