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

class Privacy extends React.Component<{}> {
  componentDidMount() {}

  render() {
    return (
      <Wrapper data-cy="privacy-page">
        <ContentContainer>
          <Heading>隐私政策</Heading>

          <Section>
            <SectionDescription>
              南京酷猿信息技术有限公司管理着云社在线论坛.
            </SectionDescription>

            <SectionDescription>
              本网站尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本网站会按照本隐私权政策的规定使用和披露您的个人信息。但本网站将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本网站不会将这些信息对外披露或向第三方提供。本网站会不时更新本隐私权政策。您在同意本网站服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本网站服务使用协议不可分割的一部分。
            </SectionDescription>

          </Section>

          <Section>
            <SectionTitle>适用范围</SectionTitle>

            <SectionDescription>
              在您使用本网站网络服务，本网站自动接收并记录的您的网站上的信息，包括但不限于您使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据
            </SectionDescription>

          </Section>

          <Section>
            <SectionTitle>信息的使用</SectionTitle>

            <SectionDescription>
              在获得您的数据之后，本网站会将其上传至服务器，以生成您的排行榜数据，以便您能够更好地使用服务
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>信息披露</SectionTitle>

            <SectionDescription>
              本网站不会将您的信息披露给不受信任的第三方。
            </SectionDescription>

            <SectionDescription>
              根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露。
            </SectionDescription>

            <SectionDescription>
              如您出现违反中国有关法律、法规或者相关规则的情况，需要向第三方披露。
            </SectionDescription>

          </Section>

          <Section>
            <SectionTitle>信息存储和交换</SectionTitle>

            <SectionDescription>
              本网站收集的有关您的信息和资料将保存在本网站及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本网站收集信息和资料所在地的境外并在境外被访问、存储和展示。
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>信息安全</SectionTitle>

            <SectionDescription>
              在使用本网站网络服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，请您立即联络本网站客服，以便本网站采取相应措施。
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>联系我们</SectionTitle>

            <SectionDescription>
              如果您对我我们的隐私政策有任何疑问，欢迎邮件咨询:{' '}
              <a href="mailto:help@corran.cn">help@corran.cn</a>
            </SectionDescription>
          </Section>
        </ContentContainer>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Privacy;
