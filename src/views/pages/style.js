import styled from 'styled-components'

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
