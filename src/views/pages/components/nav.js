// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Button, IconButton } from '../../../components/buttons'
import Link from '../../../components/link'
import Icon from '../../../components/icons'
import { Logo } from '../../../components/logo'
import Head from '../../../components/head'
import {
  NavContainer,
  Tabs,
  LogoTab,
  MenuTab,
  SupportTab,
  FeaturesTab,
  AuthTab,
  LogoLink,
  AuthLink,
  SupportLink,
  FeaturesLink,
  ExploreLink,
  MenuContainer,
  MenuOverlay
} from '../style'

type Props = {
  currentUser: Object,
  location: Object,
  dark?: boolean
}

type State = {
  menuIsOpen: boolean
}

class Nav extends React.Component<Props, State> {
  state = { menuIsOpen: false }

  toggleMenu () {
    this.setState({ menuIsOpen: !this.state.menuIsOpen })
  }

  render () {
    return (
      <NavContainer data-cy='navbar-splash'>
        <Head
          title='Xlab'
          description='The community platform for the future'
        />
        <Tabs>
          <LogoTab
            dark={this.props.dark}
            to='/about'
            data-cy='navbar-splash-about'
          >
            <Logo />
            <Icon glyph={'logo'} />
          </LogoTab>
          <FeaturesTab
            dark={this.props.dark}
            selected={this.props.location === 'features'}
            to='/features'
            data-cy='navbar-splash-features'
          >
            Features
          </FeaturesTab>
          <SupportTab
            dark={this.props.dark}
            selected={this.props.location === 'support'}
            to='/support'
            data-cy='navbar-splash-support'
          >
            Support
          </SupportTab>
          <AuthTab dark={this.props.dark}>
            <Link
              to='/login'
            >
              <Button
                data-cy='navbar-splash-signin'
                style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  letterSpacing: '0.5px'
                }}
              >
                Sign In
              </Button>
            </Link>
          </AuthTab>

          <MenuTab dark={this.props.dark} open={this.state.menuIsOpen}>
            <IconButton
              glyph={this.state.menuIsOpen ? 'view-close' : 'menu'}
              onClick={() => this.toggleMenu()}
            />
            <MenuContainer open={this.state.menuIsOpen}>
              <LogoLink to=''>
                <Logo />
              </LogoLink>
              <FeaturesLink
                to='/features'
                selected={this.props.location === 'features'}
              >
                <Icon glyph='checkmark' />Features<Icon glyph='enter' />
              </FeaturesLink>
              <SupportLink
                to='/support'
                selected={this.props.location === 'support'}
              >
                <Icon glyph='like' />Support<Icon glyph='enter' />
              </SupportLink>
              <ExploreLink
                to='/explore'
                selected={this.props.location === 'explore'}
              >
                <Icon glyph='explore' />Explore<Icon glyph='enter' />
              </ExploreLink>
              <AuthLink
                to={'/login'}
              >
                <Icon glyph='welcome' />
                <span>Sign in</span>
                <Icon glyph='enter' />
              </AuthLink>
            </MenuContainer>
            <MenuOverlay
              onClick={() => this.toggleMenu()}
              open={this.state.menuIsOpen}
            />
          </MenuTab>
        </Tabs>
      </NavContainer>
    )
  }
}

const map = state => ({ currentUser: state.users.currentUser })

export default connect(map)(Nav)
