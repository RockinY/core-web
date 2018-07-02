// @flow
import * as React from 'react'
import compose from 'recompose/compose'
import generateMetaInfo from '../../utils/generateMetaInfo'
import { connect } from 'react-redux'
import { removeItemFromStorage } from '../../helpers/localStorage'
import getEverythingThreads from '../../graphql/queries/user/getCurrentUserEverythingFeed'
import Titlebar from '../../views/titlebar'
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
