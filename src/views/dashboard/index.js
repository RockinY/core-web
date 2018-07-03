// @flow
import * as React from 'react'
import compose from 'recompose/compose'
import generateMetaInfo from '../../utils/generateMetaInfo'
import { connect } from 'react-redux'
import { removeItemFromStorage } from '../../helpers/localStorage'
import getEverythingThreads from '../../graphql/queries/user/getCurrentUserEverythingFeed'
import getCommunityThreads from '../../graphql/queries/community/getCommunityThreadConnection'
import getChannelThreadConnection from '../../graphql/queries/channel/getChannelThreadConnection'
import { getCurrentUserCommunityConnection } from '../../graphql/queries/user/getUserCommunityConnection'
import type { GetUserCommunityConnectionType } from '../../graphql/queries/user/getUserCommunityConnection'
import Titlebar from '../../views/titlebar'
import DashboardThreadFeed from './components/threadFeed'
import Head from '../../components/head'
import Menu from '../../components/menu'
import DashboardLoading from './components/dashboardLoading'
import DashboardError from './components/dashboardError'
import NewActivityIndicator from './components/newActivityIndicator'
import {
  DashboardWrapper,
  InboxWrapper,
  InboxScroller,
  FeedHeaderContainer,
  ThreadWrapper,
  ThreadScroller,
  SearchStringHeader,
  Sidebar
} from './style'
import { ErrorBoundary } from '../../components/error'

type State = {
  isHovered: boolean,
  activeChannelObject: ?Object
}

type Props = {}

class Dashboard extends React.Component<Props, State> {
  render () {
    return (
      <div>This is dashboard</div>
    )
  }
}

export default Dashboard
