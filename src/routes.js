import React from 'react'
import './reset.css.js'
import { Route, Switch, Redirect } from 'react-router'
import styled, { ThemeProvider } from 'styled-components'
import Loadable from 'react-loadable'
import { ErrorBoundary } from './components/error'
import generateMetaInfo from './utils/generateMetaInfo'
import signedOutFallback from './utils/signedOutFallback'
import { theme } from './theme'
import { Loading } from './components/loading'
import LoadingDashboard from './views/dashboard/components/dashboardLoading'
import ScrollManager from './components/scrollManager'
import { FlexCol } from './components/globals'
import Head from './components/head'
import Login from './views/login'
import { CLIENT_URL } from './constants.js'

const Body = styled(FlexCol)`
  display: flex;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  background: ${props => props.theme.bg.wash};
`

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

const DashboardFallback = signedOutFallback(Dashboard, Pages)
const LoginFallback = signedOutFallback(() => <Redirect to='/' />, Login)
const NewCommunityFallback = signedOutFallback(NewCommunity, () => (
  <Redirect to={`/login?r=${CLIENT_URL}/new/community`} />
))

class Routes extends React.Component<{||}> {
  render () {
    const { title, description } = generateMetaInfo()

    return (
      <ThemeProvider theme={theme}>
        <ErrorBoundary fallbackComponent={ErrorFallback}>
          <ScrollManager>
            <Body>
              <Head title={title} description={description} />
              <Switch>
                <Route exact path='/' component={DashboardFallback} />
                <Route path='/login' component={LoginFallback} />
                <Route path='/new/community' component={NewCommunityFallback} />
              </Switch>
            </Body>
          </ScrollManager>
        </ErrorBoundary>
      </ThemeProvider>
    )
  }
}

export default Routes
