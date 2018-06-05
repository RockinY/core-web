import React from 'react'
import './reset.css.js'
import { Route, Switch } from 'react-router'
import styled, { ThemeProvider } from 'styled-components'
import Loadable from 'react-loadable'
import { ErrorBoundary } from './components/error'
import generateMetaInfo from './utils/generateMetaInfo'
import signedOutFallback from './helpers/signedOutFallback'
import { theme } from './theme'
import { Loading } from './components/loading'
import LoadingDashboard from './views/dashboard/components/dashboardLoading'
import ScrollManager from './components/scrollManager'
import { FlexCol } from './components/globals'
import Head from './components/head'

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

const DashboardFallback = signedOutFallback(Dashboard, Pages)

class Routes extends React.Component<{||}> {
  componentDidMount () {
    // setup the amplitude
    console.warn('No amplitude api key, tracking in development mode')
  }

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

                {/* Public Business Pages */}
                <Route exact path='/about' component={Pages} />
              </Switch>
            </Body>
          </ScrollManager>
        </ErrorBoundary>
      </ThemeProvider>
    )
  }
}

export default Routes
