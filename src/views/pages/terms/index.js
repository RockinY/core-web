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
import { PrivacyTermsList } from './style'

class Terms extends React.Component<{}> {
  
  render() {
    return (
      <Wrapper data-cy="terms-page">
        <ContentContainer>
          <Heading>服务条款</Heading>

          <Section>
            <SectionDescription>
              云社是由南京酷猿信息技术有限公司（下称“南京酷猿”）提供的互联网服务。本服务条款（下称“服务条款”）是您与南京酷猿之间关于您（“您”或“用户”）访问和使用云社以及南京酷猿提供的其他服务（下称“服务”）的主要协议。您注册、登录云社和/或使用南京酷猿提供的服务，即表示您同意接受服务条款。因此，敬请仔细阅读。
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>服务内容</SectionTitle>

            <SectionDescription>
              南京酷猿保留随时变更、中止或终止部分免费服务的权利，并保留根据实际情况随时调整云社提供的服务种类、形式。南京酷猿不承担因云社提供的任何免费服务的调整给您造成的损失。尽管有本条约定，南京酷猿有权在未来恰当的时机对该等免费服务内容收取相应的服务费用。南京酷猿保留随时终止向您提供的收费服务的权利，并保留根据实际情况随时调整云社提供的收费服务种类和形式。如果南京酷猿终止提供某项收费服务，南京酷猿的义务仅在于向您返还您尚未使用的服务期对应的部分费用。但无论如何，南京酷猿将尽合理的努力给您预留合理的时间以便您为该等服务变更、中止或终止做出应对。
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>内容使用权</SectionTitle>

            <SectionDescription>
              用户在云社上发表的内容（包含但不限于云社目前各产品功能里的内容）仅表明其个人的立场和观点，并不代表南京酷猿的立场或观点。作为内容的发表者，需自行对所发表的内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律责任及连带责任，南京酷猿不承担任何法律责任及连带责任。用户在云社发布侵犯他人知识产权或其他合法权益的内容，云社有权利但无义务予以删除并保留移交司法机关处理的权利。无论是否删除或意见司法机关处理，云社均不承担任何法律责任及连带责任。
            </SectionDescription>

            <SectionDescription>
              用户不得使用云社服务发送或传播敏感信息和违反国家法律制度的信息，包括但不限于下列信息：
            </SectionDescription>

            <PrivacyTermsList>
              <li>反对宪法所确定的基本原则的；</li>
              <li>危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
              <li>损害国家荣誉和利益的；</li>
              <li>煽动民族仇恨、民族歧视，破坏民族团结的；</li>
              <li>破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
              <li>散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
              <li>散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
              <li>侮辱或者诽谤他人，侵害他人合法权益的；</li>
              <li>含有法律、行政法规禁止的其他内容的。</li>
            </PrivacyTermsList>
          </Section>

          <Section>
            <SectionTitle>服务条款的完善和修改</SectionTitle>

            <SectionDescription>
              南京酷猿有权根据互联网的发展和中华人民共和国有关法律、法规的变化，不时地完善和修改南京酷猿服务条款。南京酷猿保留随时修改服务条款的权利，用户在使用南京酷猿的服务时，有必要对最新的南京酷猿服务条款进行仔细阅读和重新确认，当发生相关争议时，以最新的服务条款为准。
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>特别约定</SectionTitle>

            <SectionDescription>
              本服务条款及其下的服务受中华人民共和国法律管辖，并按之解释。
            </SectionDescription>

            <SectionDescription>
              用户使用本服务的行为若有任何违反国家法律法规或侵犯任何第三方合法权益的情形，南京酷猿有权直接删除该等违反规定的信息，并可以暂停或终止向该用户提供服务。若用户利用本服务从事任何违法或侵权行为，由用户自行承担全部责任，南京酷猿不承担任何法律责任及连带责任。因此给南京酷猿或任何第三方造成任何损失的，用户应负责全额赔偿。
            </SectionDescription>
          </Section>

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
