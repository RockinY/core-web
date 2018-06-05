import React from 'react'
import Home from './home'
import { Page } from './style'

type Props = {
  match: Object
}

class Pages extends React.Component<Props> {
  renderPage = () => {
    switch (this.props.match.path) {
      case '/':
      default: {
        return <Home {...this.props} />
      }
    }
  }

  render () {
    return (
      <Page id='main'>
        {this.renderPage()}
      </Page>
    )
  }
}

export default Pages
