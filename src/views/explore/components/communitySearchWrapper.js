// @flow
import React from 'react';
import styled from 'styled-components';
import Link from '../../../components/link';
import { Transition, zIndex, Shadow, hexa } from '../../../components/globals';
import ViewSegment from '../../../components/themedSection';
import { Button } from '../../../components/buttons';
import { CLIENT_URL } from '../../../constants';
import { Tagline, Copy, Content } from '../../pages/style';

// $FlowFixMe
const CommunitySearchWrapper = props => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 0;
    padding: 16px;

    @media (max-width: 640px) {
      margin-top: 80px;
      margin-bottom: 0;
      width: 100%;
    }
  `;

  const PrimaryCTA = styled(Button)`
    padding: 12px 16px;
    font-weight: 700;
    font-size: 14px;
    border-radius: 12px;
    background-color: ${props => props.theme.bg.default};
    background-image: none;
    color: ${props => props.theme.brand.alt};
    transition: ${Transition.hover.off};
    z-index: ${zIndex.card};

    &:hover {
      background-color: ${props => props.theme.bg.default};
      color: ${props => props.theme.brand.default};
      box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
      transition: ${Transition.hover.on};
    }
  `;

  const SecondaryContent = styled(ThisContent)`
    margin-top: 0;
    margin-bottom: 0;
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
  `;

  const SecondaryTagline = styled(ThisTagline)`
    font-size: 20px;
    font-weight: 900;
    margin-top: 0;
    margin-bottom: 2px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 16px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const SecondaryCopy = styled(ThisCopy)`
    margin-bottom: 16px;
  `;

  return (
    <ViewSegment goop={3} background="constellations">
      <ThisContent>
        <ThisTagline>寻找一个感兴趣的社区!</ThisTagline>
        <ThisCopy>
          试着搜索一下「 潮流 」或者「 酷猿信息技术 」
        </ThisCopy>
        {props.children}
        <SecondaryContent>
          <SecondaryTagline>...或者创建你自己的社区</SecondaryTagline>
          <SecondaryCopy>
            在云社上面创建社区是永远免费的！
          </SecondaryCopy>
          {props.currentUser ? (
            <Link
              to={'/new/community'}
            >
              <PrimaryCTA>开始</PrimaryCTA>
            </Link>
          ) : (
            <Link to={`/login?r=${CLIENT_URL}/new/community`}>
              <PrimaryCTA>开始</PrimaryCTA>
            </Link>
          )}
        </SecondaryContent>
      </ThisContent>
    </ViewSegment>
  );
};

export default CommunitySearchWrapper;
