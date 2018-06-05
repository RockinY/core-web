// @flow
import React from 'react'
import Link from '../../components/link'
import Section from '../../components/themedSection'
import styled from 'styled-components'
import {
  FlexCol
} from '../../components/globals'
import {
  Tagline,
  Copy,
  Flexer,
  PrimaryCTA,
  SecondaryCTA,
  Content
} from './style'

type Props = Object

export const Overview = (props: Props) => {
  const ThisContent = styled(Content)`
    max-width: 100vw;
    margin-top: 92px;
    margin-bottom: 80px;

    @media (max-width: 640px) {
      margin-bottom: 40px;
    }
  `

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
  `

  const ThisCopy = styled(Copy)`
    line-height: 1.6;
    font-weight: 500;
    max-width: 580px;

    @media (max-width: 768px) {
      text-align: center;
    }
  `

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
    font-size: 40px;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  `

  const Actions = styled(Flexer)`
    margin-top: 48px;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 768px) {
      align-items: center;
    }
  `

  const ThisSecondaryCTA = styled(SecondaryCTA)`
    margin-left: 16px;
    font-size: 16px;
    border: 2px solid ${props => props.theme.text.reverse};

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 16px;
    }
  `

  const ThisText = styled(Text)`
    position: relative;
    right: 20vw;

    @media (max-width: 1400px) {
      right: 15vw;
    }

    @media (max-width: 1200px) {
      right: 0;
    }
  `

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    font-size: 16px;
  `

  return (
    <Section background='constellations' goop={2}>
      <ThisContent>
        <ThisText>
          <ThisTagline>The community platform for the future.</ThisTagline>
          <ThisCopy>The internet was built for communities.</ThisCopy>
          <ThisCopy>
            But, as the web has changed and improved radically, community
            software has hardly improved since the heyday of messageboards and
            IRC.
          </ThisCopy>
          <ThisCopy>
            Spectrum makes it easy to grow safe, successful online communities
            that are built to last.
          </ThisCopy>
          <Actions>
            <Link
              to="/login"
            >
              <ThisPrimaryCTA icon="welcome">Join Spectrum</ThisPrimaryCTA>
            </Link>
            <Link
              to="/new/community"
            >
              <ThisSecondaryCTA icon="plus-fill">
                Create your community
              </ThisSecondaryCTA>
            </Link>
          </Actions>
        </ThisText>
      </ThisContent>
    </Section>
  )
}
