// Render a component depending on a users authentication status
import React from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'

// Make the decision at the render time
const Switch = props => {
  const { Component, FallbackComponent, currentUser, ...rest } = props
  const { authed } = queryString.parse(props.location.search)
  if ((!currentUser && !authed) || !Component) {
    return <FallbackComponent {...rest} />
  } else {
    return <Component {...rest} />
  }
}

// Connect the switch to the redux state
const ConnectedSwitch = connect(state => {
  return {
    currentUser: state.users.currentUser
  }
})(Switch)

const signedOutFallback = (Component, FallbackComponent) => {
  return props => (
    <ConnectedSwitch
      {...props}
      FallbackComponent={FallbackComponent}
      Component={Component}
    />
  )
}

export default signedOutFallback
