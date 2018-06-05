// @flow
import React from 'react'
import compose from 'recompose/compose'
import { withRouter } from 'react-router'
import { Wrapper } from './style'

const AppViewWrapperPure = props => {
  return (
    <Wrapper {...props} id='scroller-for-thread-feed'>
      {props.children}
    </Wrapper>
  )
}

// withRouter passes match, history and location props to the wrapped component
const AppViewWrapper = compose(withRouter)(AppViewWrapperPure)

export default AppViewWrapper
