// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, IconButton } from '../../../components/buttons';
import Link from '../../../components/link';
import Icon from '../../../components/icons';
import { Logo } from '../../../components/logo';
import Avatar from '../../../components/avatar';
import Head from '../../../components/head';
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
  DropdownLink,
  MenuContainer,
  MenuOverlay,
} from '../style';

type Props = {
  currentUser: Object,
  location: Object,
  dark?: boolean,
};

type State = {
  menuIsOpen: boolean,
};

class Nav extends React.Component<Props, State> {
  state = { menuIsOpen: false };

  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }

  render() {
    return (
      <NavContainer data-cy="navbar-splash">
        <Head
          title={'云社'}
          description={'更好用的新一代网络社区.'}
        >
          <link
            rel="shortcut icon"
            id="dynamic-favicon"
            // $FlowIssue
            href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
          />
        </Head>
        <Tabs>
          <LogoTab
            dark={this.props.dark}
            to="/about"
            data-cy="navbar-splash-about"
          >
            <Logo />
            <Icon glyph={'logo'} />
          </LogoTab>
          <FeaturesTab
            dark={this.props.dark}
            selected={this.props.location === 'features'}
            to="/features"
            data-cy="navbar-splash-features"
          >
            特征
          </FeaturesTab>
          <SupportTab
            dark={this.props.dark}
            selected={this.props.location === 'support'}
            to="/support"
            data-cy="navbar-splash-support"
          >
            支持
          </SupportTab>
          <AuthTab dark={this.props.dark}>
            {this.props.currentUser ? (
              <Link to={'/'} data-cy="navbar-splash-profile">
                <Avatar
                  src={this.props.currentUser.profilePhoto}
                  user={this.props.currentUser}
                />
              </Link>
            ) : (
              <Link
                to="/login"
              >
                <Button
                  data-cy="navbar-splash-signin"
                  style={{
                    fontWeight: '700',
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                  }}
                >
                  登陆
                </Button>
              </Link>
            )}
          </AuthTab>
          <MenuTab dark={this.props.dark} open={this.state.menuIsOpen}>
            <IconButton
              glyph={this.state.menuIsOpen ? 'view-close' : 'menu'}
              onClick={() => this.toggleMenu()}
            />
            <MenuContainer open={this.state.menuIsOpen}>
              <LogoLink to="/">
                <Logo />
              </LogoLink>
              <DropdownLink
                to="/features"
                selected={this.props.location === 'features'}
              >
                <Icon glyph="checkmark" />特征
              </DropdownLink>
              <DropdownLink
                to="/support"
                selected={this.props.location === 'support'}
              >
                <Icon glyph="like" />支持
              </DropdownLink>
              <DropdownLink
                to="/explore"
                selected={this.props.location === 'explore'}
              >
                <Icon glyph="explore" />探索
              </DropdownLink>
              {this.props.currentUser ? (
                <AuthLink to={'/'}>
                  <span>返回主页</span>
                </AuthLink>
              ) : (
                <AuthLink
                  to={'/login'}
                >
                  <span>注册或者登陆</span>
                </AuthLink>
              )}
            </MenuContainer>
            <MenuOverlay
              onClick={() => this.toggleMenu()}
              open={this.state.menuIsOpen}
            />
          </MenuTab>
        </Tabs>
      </NavContainer>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

// $FlowIssue
export default connect(map)(Nav);
