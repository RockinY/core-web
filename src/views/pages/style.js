import styled from 'styled-components'
import {
  FlexCol,
  zIndex
} from '../../components/globals'

export const Page = styled.main`
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'content';
  overflow: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.bg.default};
`

export const Wrapper = styled(FlexCol)`
  grid-area: content;
  height: 100%;
  min-height: 100vh;
  min-width: 100vw;
  width: 100%;
  max-width: 100vw;
  background-color: ${({ theme }) => theme.bg.default};
  overflow: hidden;
  z-index: ${zIndex.base};
`

export const Footer = styled.div`
  display: flex;
  justify-content: stretch;
  align-content: stretch;
  flex: auto;
  position: relative;
  padding: 32px;
  background-color: ${({ theme }) => theme.bg.reverse};
  color: ${({ theme }) => theme.text.reverse};
`

export const FooterGrid = styled.div`
  flex: auto;
  display: grid;
  grid-template-columns: auto 1fr repeat(2, minmax(160px, auto));
  grid-template-rows: 1fr;
  grid-column-gap: 32px;
  grid-template-areas: 'masthead . support safety';
  align-items: flex-start;
  justify-items: flex-start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr;
    grid-column-gap: 0;
    grid-row-gap: 32px;
    grid-template-areas: 'masthead' 'support' 'safety';
  }
`

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;

  font-weight: 500;
  font-size: 16px;

  span {
    color: ${props => props.theme.text.alt};
    font-weight: 700;
  }
`

export const Masthead = styled(FooterSection)`
  grid-area: masthead;
`

export const LinkSection = styled(FooterSection)`
  a {
    position: relative;
    padding-bottom: 2px;
    display: inline-block;
    align-self: flex-start;

    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      content: '';
      height: 2px;
      width: 0%;
      opacity: 0;
      background-color: ${props => props.theme.text.reverse};
      transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
    }

    &:hover {
      &:after {
        width: 100%;
        opacity: 1;
        transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
      }
    }
  }

  span + a,
  a + a {
    margin-top: 8px;
  }
`

export const Support = styled(LinkSection)`
  grid-area: support;
`

export const Safety = styled(LinkSection)`
  grid-area: safety;

  span + a,
  a + a {
    margin-top: 8px;
  }
`

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;

  > a + a {
    margin-left: 8px;
  }
`
