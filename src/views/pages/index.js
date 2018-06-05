import React from 'react'
import Nav from './components/nav'
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
    const { match: { path } } = this.props
    const dark = path === '/' || path === '/about'

    return (
      <Page id='main'>
        <Nav dark={dark ? 1 : 0} location={this.props.match.path.substr(1)} />
        {this.renderPage()}
      </Page>
    )
  }
}

export default Pages
