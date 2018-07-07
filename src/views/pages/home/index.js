// @flow
import React from 'react'
import { storeItem, getItemFromStorage } from '../../../utils/localStorage'
import PageFooter from '../components/footer'
import { Wrapper } from '../style'
import { Overview } from '../view'

type State = {
  preferredSigninMethod: string
}

class Splash extends React.Component<{}, State> {
  constructor () {
    super()
    const preferredSigninMethod = getItemFromStorage('preferred_signin_method')
    this.state = {
      preferredSigninMethod
    }
  }

  trackSignin = (type: string, method: string) => {
    storeItem('preferred_signin_method', method)
  }

  render () {
    return (
      <Wrapper data-cy='home-page'>
        <Overview />
        <PageFooter />
      </Wrapper>
    )
  }
}

export default Splash
