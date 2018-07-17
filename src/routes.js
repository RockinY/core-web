import React from 'react'
import './reset.css.js'
import { Route, Switch, Redirect } from 'react-router'
import styled, { ThemeProvider } from 'styled-components'
import Loadable from 'react-loadable'
import { ErrorBoundary } from './components/error'
import generateMetaInfo from './utils/generateMetaInfo'
import signedOutFallback from './utils/signedOutFallback'
import { theme } from './theme'
import { Loading, LoadingScreen } from './components/loading'
import LoadingDashboard from './views/dashboard/components/dashboardLoading'
import ScrollManager from './components/scrollManager'
import { FlexCol } from './components/globals'
import Head from './components/head'
import Login from './views/login'
import { CLIENT_URL } from './constants.js'
import AuthViewHandler from './views/authViewHandler'
import Status from './views/status'
import ModalRoot from './components/modals/modalRoot'
import Toasts from './components/toasts'
import Gallery from './components/gallery'
import ThreadSlider from './views/threadSlider'
import Composer from './components/composer'
import DirectMessages from './views/directMessages'
import Thread from './views/thread'
import PrivateChannelJoin from './views/privateChannelJoin'
import PrivateCommunityJoin from './views/privateCommunityJoin'
import Navbar from './views/navbar'

const Body = styled(FlexCol)`
  display: flex;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  background: ${props => props.theme.bg.wash};
`

const Explore = Loadable({
  loader: () => import('./views/explore'/* webpackChunkName: "Explore" */),
  loading: ({ isLoading }) => isLoading && <Loading />
})

const ErrorFallback = Loadable({
  loader: () => import('./components/error'),
  loading: ({ isLoading }) => isLoading && <Loading />
})

const Pages = Loadable({
  loader: () => import('./views/pages'),
  loading: ({ isLoading }) => isLoading && null
})

const Dashboard = Loadable({
  loader: () => import('./views/dashboard'),
  loading: ({ isLoading }) => isLoading && <LoadingDashboard />
})

const NewCommunity = Loadable({
  loader: () => import('./views/newCommunity'),
  loading: ({ isLoading }) => isLoading && <Loading />
})

const UserView = Loadable({
  loader: () => import('./views/user'/* webpackChunkName: "UserView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />
})

const ChannelView = Loadable({
  loader: () => import('./views/channel'/* webpackChunkName: "ChannelView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
})

const UserSettings = Loadable({
  loader: () => import('./views/userSettings'/* webpackChunkName: "UserSettings" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
})

const ChannelSettings = Loadable({
  loader: () => import('./views/channelSettings'/* webpackChunkName: "channelSettings" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
})

const CommunitySettings = Loadable({
  loader: () => import('./views/communitySettings'/* webpackChunkName: "communitySettings" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
})

const Notifications = Loadable({
  loader: () => import('./views/notifications'/* webpackChunkName: "Notifications" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
})

const CommunityLoginView = Loadable({
  loader: () => import('./views/communityLogin'/* webpackChunkName: "CommunityView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
})

const CommunityView = Loadable({
  loader: () => import('./views/community'/* webpackChunkName: "CommunityView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
})

const DashboardFallback = signedOutFallback(Dashboard, Pages)
const HomeFallback = signedOutFallback(Dashboard, () => <Redirect to="/" />)
const LoginFallback = signedOutFallback(() => <Redirect to='/' />, Login)
const NewCommunityFallback = signedOutFallback(NewCommunity, () => (
  <Redirect to={`/login?r=${CLIENT_URL}/new/community`} />
))
const ComposerFallback = signedOutFallback(Composer, () => (
  <Login redirectPath={`${CLIENT_URL}/new/thread`} />
))
const MessagesFallback = signedOutFallback(DirectMessages, () => (
  <Login redirectPath={`${CLIENT_URL}/messages`} />
))
const UserSettingsFallback = signedOutFallback(UserSettings, () => (
  <Login redirectPath={`${CLIENT_URL}/me/settings`} />
))
const NotificationsFallback = signedOutFallback(Notifications, () => (
  <Login redirectPath={`${CLIENT_URL}/notifications`} />
))
const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () => (
  <Login />
))
const CommunitySettingsFallback = signedOutFallback(CommunitySettings, () => (
  <Login />
))

class Routes extends React.Component<{||}> {
  render () {
    const { title, description } = generateMetaInfo()

    return (
      <ThemeProvider theme={theme}>
        <ErrorBoundary fallbackComponent={ErrorFallback}>
          <ScrollManager>
            <Body>
              {/* Default meta tags, get overriden by anything further down the tree */}
              <Head title={title} description={description} />
              {/* Global navigation, notifications, message notifications, etc */}
              {/*
                AuthViewHandler often returns null, but is responsible for triggering
                things like the 'set username' prompt when a user auths and doesn't
                have a username set.
              */}
              <Route component={AuthViewHandler} />
              <Status />
              <Route component={Navbar} />

              <Route component={ModalRoot} />
              <Route component={Toasts} />
              <Route component={Gallery} />
              <Route component={ThreadSlider} />

              <Switch>
                <Route exact path='/' component={DashboardFallback} />
                <Route exact path="/home" component={HomeFallback} />

                {/* Public Business Pages */}
                <Route path="/about" component={Pages} />
                <Route path="/contact" component={Pages} />
                <Route path="/terms" component={Pages} />
                <Route path="/privacy" component={Pages} />
                <Route path="/terms.html" component={Pages} />
                <Route path="/privacy.html" component={Pages} />
                <Route path="/code-of-conduct" component={Pages} />
                <Route path="/support" component={Pages} />
                <Route path="/features" component={Pages} />
                <Route path="/faq" component={Pages} />

                {/* App Pages */}
                <Route path="/new/community" component={NewCommunityFallback} />
                <Route path="/new/thread" component={ComposerFallback} />

                <Route path='/login' component={LoginFallback} />
                <Route path='/explore' component={Explore}/>
                <Route path="/messages/new" component={MessagesFallback} />
                <Route path="/messages/:threadId" component={MessagesFallback} />
                <Route path="/messages" component={MessagesFallback} />
                <Route path="/thread/:threadId" component={Thread} />
                <Route path="/thread" render={() => <Redirect to="/" />} />
                <Route exact path="/users" render={() => <Redirect to="/" />} />
                <Route exact path="/users/:username" component={UserView} />
                <Route exact path="/users/:username/settings" component={UserSettingsFallback} />
                <Route path="/notifications" component={NotificationsFallback} />

                {/*
                    We check communitySlug last to ensure none of the above routes
                    pass. We handle null communitySlug values downstream by either
                    redirecting to home or showing a 404
                  */}
                <Route
                  path="/:communitySlug/:channelSlug/settings"
                  component={ChannelSettingsFallback}
                />
                <Route
                  path="/:communitySlug/:channelSlug/join/:token"
                  component={PrivateChannelJoin}
                />
                <Route
                  path="/:communitySlug/:channelSlug/join"
                  component={PrivateChannelJoin}
                />
                <Route
                  path="/:communitySlug/settings"
                  component={CommunitySettingsFallback}
                />
                <Route
                  path="/:communitySlug/join/:token"
                  component={PrivateCommunityJoin}
                />
                <Route
                  path="/:communitySlug/login"
                  component={CommunityLoginView}
                />
                <Route
                  path="/:communitySlug/:channelSlug"
                  component={ChannelView}
                />
                <Route path="/:communitySlug" component={CommunityView} />
              </Switch>
            </Body>
          </ScrollManager>
        </ErrorBoundary>
      </ThemeProvider>
    )
  }
}

export default Routes
