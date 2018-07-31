// @flow
import React from 'react';
import styled from 'styled-components';
import Link from '../../components/link';
import Icon from '../../components/icons';
import Avatar from '../../components/avatar';
import {
  Shadow,
  Gradient,
  FlexCol,
  Transition,
  HorizontalRule,
} from '../../components/globals';
import Section from '../../components/themedSection';
import { Conversation, Discover } from '../../components/illustrations';
import {
  AbstractLogo,
  BootstrapLogo,
  ExpoLogo,
  SketchLogo,
  NodeLogo,
} from './components/logos';
import {
  Tagline,
  Copy,
  Bullets,
  Bullet,
  BulletHeading,
  BulletTitle,
  BulletCopy,
  Flexer,
  PrimaryCTA,
  SecondaryCTA,
  Content,
} from './style';
import Search from '../explore/components/search'

type Props = Object;

export const Overview = (props: Props) => {
  const ThisContent = styled(Content)`
    max-width: 100vw;
    margin-top: 92px;
    margin-bottom: 80px;

    @media (max-width: 640px) {
      margin-bottom: 40px;
    }
  `;

  const Text = styled(FlexCol)`
    margin: 120px 32px 120px 32px;
    text-align: left;
    align-items: flex-start;
    z-index: 2;

    @media (max-width: 768px) {
      margin-top: 0;
      margin-bottom: 16px;
      text-align: center;
      align-items: center;
    }
  `;

  const ThisCopy = styled(Copy)`
    line-height: 1.6;
    font-weight: 500;
    max-width: 580px;

    @media (max-width: 768px) {
      text-align: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
    font-size: 40px;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  `;

  const Actions = styled(Flexer)`
    margin-top: 48px;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 768px) {
      align-items: center;
    }
  `;

  const ThisSecondaryCTA = styled(SecondaryCTA)`
    margin-left: 16px;
    font-size: 16px;
    border: 2px solid ${props => props.theme.text.reverse};

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 16px;
    }
  `;

  const ThisText = styled(Text)`
    position: relative;
    right: 20vw;

    @media (max-width: 1400px) {
      right: 15vw;
    }

    @media (max-width: 1200px) {
      right: 0;
    }
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    font-size: 16px;
    border: 2px solid ${props => props.theme.bg.default};
  `;

  const Img = styled.img`
    position: absolute;
    top: 32px;
    bottom: 0;
    left: calc(25vw + 480px);
    max-height: calc(100% - 32px);
    z-index: 0;

    @media (max-width: 1400px) {
      left: calc(20vw + 480px);
    }

    @media (max-width: 1200px) {
      display: none;
    }

    @media (max-width: 768px) {
      display: none;
    }
  `;

  return (
    <Section background="constellations" goop={0}>
      <ThisContent>
        <ThisText>
          <ThisTagline>相信我，这才是你一直想要的社区.</ThisTagline>
          <ThisCopy></ThisCopy>
          <Search />
          <ThisCopy>
            云社拥有其他社区所不具备实时互动性，针对社区版主，云社赋予了其最大的管理权限，同时如果你愿意的话，还可以在上面创建一个完全私密的社区.
          </ThisCopy>
          <Actions>
            <Link
              to="/login"
            >
              <ThisPrimaryCTA icon="welcome">体验一下云社</ThisPrimaryCTA>
            </Link>
            <Link
              to="/new/community"
            >
              <ThisSecondaryCTA icon="plus-fill">创建自己的社区</ThisSecondaryCTA>
            </Link>
          </Actions>
        </ThisText>
        <Img src={'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/mix/waterfall.png?x-oss-process=style/big'} alt="" />
      </ThisContent>
    </Section>
  );
};

export const Centralized = (props: Props) => {
  const ThisContent = styled(Content)`
    img {
      margin: 24px 0;
    }
  `;

  const Text = styled(FlexCol)`
    margin: 40px 16px 64px;

    @media (max-width: 768px) {
      margin-top: 20px;
      margin-bottom: 44px;
    }
  `;

  const ThisCopy = styled(Copy)`
    font-weight: 400;
    margin-top: 16px;
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    margin-top: 32px;
    background-color: ${props => props.theme.brand.alt};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    color: ${props => props.theme.text.reverse};

    &:hover {
      color: ${props => props.theme.text.reverse};
    }
  `;

  const Actions = styled.div`
    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  `;

  const LogoSection = styled.div`
    display: flex;
    align-self: center;
    max-width: 80vw;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    z-index: 2;
    margin-bottom: 80px;

    img {
      margin-top: 32px;
      margin-right: 32px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  `;

  return (
    <Section goop={0} color={'space.alt'}>
      <ThisContent>
        <Discover />
        <Text>
          <ThisTagline>属于你的地盘</ThisTagline>
          <ThisCopy>
            这里创建的论坛将会非常容易被别人搜索及发现.
          </ThisCopy>
          <ThisCopy>
            同时你也将能够同时管理多个论坛话题，你需要的只是一个统一的账户管理，
            之后所有的消息提示和管理你都将一手掌控!
          </ThisCopy>
          <Actions>
            <Link to="/explore">
              <ThisPrimaryCTA
                icon="explore"
              >
                发现更多的论坛
              </ThisPrimaryCTA>
            </Link>
          </Actions>
        </Text>
      </ThisContent>
      <LogoSection>
        <BootstrapLogo />
        <ExpoLogo />
        <SketchLogo />
        <AbstractLogo />
        <NodeLogo />
      </LogoSection>
    </Section>
  );
};

export const CommunitySearch = (props: Props) => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 80px;
    padding: 16px;

    @media (max-width: 640px) {
      margin-top: 80px;
      width: 100%;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 18px;
    margin-bottom: 32px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  return (
    <Section goop={0} background="bright">
      <ThisContent>
        <ThisTagline>尝试寻找一个您感兴趣的论坛!</ThisTagline>
        <ThisCopy>
          试着搜索一下 「 区块链 」或者 「 酷猿信息技术 」!
        </ThisCopy>
      </ThisContent>
    </Section>
  );
};

export const Chat = (props: Props) => {
  const ThisContent = styled(Content)`
    overflow: hidden;
    margin: 40px 16px 80px;

    @media (max-width: 768px) {
      margin-bottom: 40px;
    }
  `;

  const ThisCopy = styled(Copy)`
    font-weight: 400;
    margin-top: 16px;
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    background-color: ${props => props.theme.brand.alt};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    color: ${props => props.theme.text.reverse};
    margin-top: 32px;

    &:hover {
      color: ${props => props.theme.text.reverse};
    }
  `;

  const Actions = styled.div`
    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  `;

  return (
    <Section goop={2} color={'bg.reverse'}>
      <ThisContent>
        <Conversation />
        <FlexCol>
          <ThisTagline>令人愉悦的实时通讯体验</ThisTagline>
          <ThisCopy>
            就像你最喜欢的各种其他聊天软件，在这里的交流就像和对方面对面聊天一样方便.
          </ThisCopy>
          <ThisCopy>
            每段聊天都会生成一个独立的链接，你可很方便的存储或者分享这些聊天记录
          </ThisCopy>

          <Actions>
            <Link
              to="/thread/764331db-16dd-4fc4-a2c5-aabd735a64a9"
            >
              <ThisPrimaryCTA icon="message-fill">
                查看我的对话
              </ThisPrimaryCTA>
            </Link>
          </Actions>
        </FlexCol>
      </ThisContent>
    </Section>
  );
};

export const Sell = (props: Props) => {
  const Text = styled(FlexCol)`
    align-items: center;
    margin: 40px 0;
  `;

  const ThisContent = styled(Content)`
    margin-bottom: 80px;
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
    margin-left: 16px;
    margin-right: 16px;
  `;

  const Actions = styled(Flexer)`
    margin-bottom: 48px;
    justify-content: center;
  `;

  const ThisSection = styled(Section)`
    margin-bottom: 40px;
  `;

  return (
    <ThisSection goop={0} background="dark" color={'bg.reverse'}>
      <ThisContent>
        <Text>
          <ThisTagline>Spectrum saves you time and money</ThisTagline>
          <Bullets>
            <Bullet>
              <BulletHeading>
                <BulletTitle>Supercharge support</BulletTitle>
              </BulletHeading>
              <BulletCopy>
                Stop wasting time with endless private customer support threads
                answering the same question over and over.
              </BulletCopy>
              <BulletCopy>
                Now your team can have conversations with your community as a
                whole and chat privately when a particular issue is sensitive.
              </BulletCopy>
            </Bullet>
            <Bullet>
              <BulletHeading>
                <BulletTitle>Bring people together</BulletTitle>
              </BulletHeading>
              <BulletCopy>
                Spectrum gives your top supporters and advocates a place to
                share their knowledge, empower others, and foster a place of
                belonging for everyone.
              </BulletCopy>
            </Bullet>
            <Bullet>
              <BulletHeading>
                <BulletTitle>Tighten your feedback loop</BulletTitle>
              </BulletHeading>
              <BulletCopy>
                There’s no better feedback than the insights that come directly
                from your customers.
              </BulletCopy>
              <BulletCopy>
                Think of Spectrum as a new direct line to discovering what your
                audience wants the most.
              </BulletCopy>
            </Bullet>
          </Bullets>
        </Text>
      </ThisContent>
      <Actions>
        <Link
          to="/new/community"
        >
          <PrimaryCTA icon="plus-fill">
            Start building your community
          </PrimaryCTA>
        </Link>
      </Actions>
    </ThisSection>
  );
};

export const Yours = (props: Props) => {
  const ThisContent = styled(Content)`
    margin: 60px 16px 80px;
    font-size: 18px;
    align-items: center;
    text-align: left;
  `;

  const ThisTagline = styled(Tagline)`
    text-align: center;
    align-self: center;
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    font-size: 16px;
    color: ${props => props.theme.text.default};

    &:hover {
      color: ${props => props.theme.brand.alt};
      box-shadow: ${Shadow.high} #000;
    }
  `;

  const Actions = styled(Flexer)`
    margin-top: 32px;
    justify-content: center;

    > a {
      display: inline-block;
    }

    @media (max-width: 768px) {
      justify-content: center;
    }
  `;

  const Quotes = styled.div`
    display: flex;
    flex: auto;
    align-items: start;
    justify-content: center;
    padding: 40px 0;
    max-width: 100vw;
    flex-wrap: wrap;
    margin-left: -32px;

    @media (max-width: 768px) {
      display: none;
    }
  `;

  const Quote = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: white;
    width: 400px;
    min-width: 320px;
    flex: none;
    box-shadow: 0 8px 16px #000;
    color: ${props => props.theme.text.default};
    position: relative;
    padding: 24px;
    transition: ${Transition.hover.off};
    margin-top: 32px;
    margin-left: 32px;

    &:hover {
      box-shadow: 0 0px 32px ${props => props.theme.brand.alt};
      transition: ${Transition.hover.on};

      > div {
        color: ${props => props.theme.brand.alt};
        transition: ${Transition.hover.on};
      }
    }
  `;

  const Pullquote = styled.p`
    padding: 0;
    padding-left: 16px;
    line-height: 1.6;
    margin: 16px 8px 8px 8px;
    font-size: 16px;
    position: relative;
    z-index: 2;
  `;

  const Signature = styled(Link)`
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 16px;
    margin-left: 8px;

    div {
      margin-right: 8px;
    }

    span {
      color: ${props => props.theme.text.alt};
      font-weight: 400;
      margin-left: 4px;
    }
  `;

  const Rule = styled(HorizontalRule)`
    color: ${props => props.theme.brand.border};
    transition: ${Transition.hover.off};

    hr {
      color: inherit;
      border-color: currentColor;
    }
  `;

  return (
    <Section goop={0} background={'reverse'}>
      <ThisContent>
        <FlexCol>
          <ThisTagline>You’re gonna love Spectrum.</ThisTagline>
          <Quotes>
            <Quote>
              <Rule>
                <hr />
                <Icon glyph="quote" />
                <hr />
              </Rule>
              <Pullquote>
                okay, honestly Spectrum is the best thing that happened to me
                regarding social interaction in 2017
              </Pullquote>
              <Signature to="/users/Traykov">
                <Avatar
                  size={'40'}
                  src="https://spectrum.imgix.net/users/ZN37gjzZ31PKVPmd6E4ZTlZJa7Z2/5sasho.png.0.17582088793809425?auto=compress&w=64&dpr=2&format=png"
                />Alexander Traykov<span>@Traykov</span>
              </Signature>
            </Quote>
            <Quote>
              <Rule>
                <hr />
                <Icon glyph="quote" />
                <hr />
              </Rule>
              <Pullquote>
                Spectrum will take the place that Reddit used to have a long
                time ago for communities (especially tech) to freely share ideas
                and interact. Except realtime and trolling-free
              </Pullquote>
              <Signature to="/users/rauchg">
                <Avatar
                  size={'40'}
                  src="https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F871555682608136205%2FyMs8Gnot_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=cc42ed724e75265fbb959ec43c910be2"
                />Guillermo Rauch <span>@rauchg</span>
              </Signature>
            </Quote>
            <Quote>
              <Rule>
                <hr />
                <Icon glyph="quote" />
                <hr />
              </Rule>
              <Pullquote>
                Spectrum is definitely a product worth looking out for. Huge fan
                and been lovely to be a part of the unique communities.
              </Pullquote>
              <Signature to="/users/tayler-m-odea">
                <Avatar
                  size={'40'}
                  src="https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F900025975278157824%2FmydeOAGa_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=a50556fe67cb087d5083b9d1342711ab"
                />Tayler O’Dea <span>@tayler-m-odea</span>
              </Signature>
            </Quote>
          </Quotes>
          <Actions>
            <Link
              to="/login"
            >
              <ThisPrimaryCTA icon="welcome">Join Spectrum</ThisPrimaryCTA>
            </Link>
          </Actions>
        </FlexCol>
      </ThisContent>
    </Section>
  );
};
