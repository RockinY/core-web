// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import {
  ContentContainer,
  Heading,
  Section,
  SectionTitle,
  SectionDescription,
} from '../pricing/style';

class Terms extends React.Component<{}> {
  
  render() {
    return (
      <Wrapper data-cy="terms-page">
        <ContentContainer>
          <Heading>服务条款</Heading>

          <Section>
            <SectionTitle>联系我们</SectionTitle>

            <SectionDescription>
              如果您对我我们的服务条款有任何疑问，欢迎邮件咨询:{' '}
              <a href="mailto:help@corran.cn">help@corran.cn</a>
            </SectionDescription>
          </Section>
        </ContentContainer>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Terms;
