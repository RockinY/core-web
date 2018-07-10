// @flow
import * as React from 'react';
import Section from '../../../../components/themedSection';
import CommunityList from './communityList';
import { PrimaryCTA } from '../../style';
import { Content, Heading, Copy } from '../style';

const Discount = () => {
  return (
    <Section background={'dark'} goop={2} color={'bg.default'}>
      <Content>
        <Heading reverse>Do you run a community that gives back?</Heading>
        <Copy reverse>
          If you're looking for a place to grow your community for an
          open-source project, non-profit, or educational program, we're here to
          help.
        </Copy>
        <Copy reverse>
          Qualifying communities get one additional moderator seat and one
          private channel for free.
        </Copy>
        <CommunityList />
        <a href="mailto:hi@spectrum.chat">
          <PrimaryCTA
            icon={'payment'}
          >
            Apply for discount
          </PrimaryCTA>
        </a>
      </Content>
    </Section>
  );
};

export default Discount;
