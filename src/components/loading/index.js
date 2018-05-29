// @flow
import React from 'react'
import styled from 'styled-components'
import { Spinner } from '../globals'

const LoadingContainer = styled.div`
  display: flex;
  flex: auto;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const Loading = ({
  size,
  color
}: {
  size?: number,
  color?: string
}) => (
  <LoadingContainer>
    <Spinner size={size} color={color} />
  </LoadingContainer>
)
