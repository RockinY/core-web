// @flow
import React from 'react'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import queryString from 'query-string'
import { Button, TextButton } from '../../components/buttons'
import AppViewWrapper from '../../components/appViewWrapper'
import Column from '../../components/column'
import { Loading } from '../../components/loading'
import CreateCommunityForm from './components/createCommunityForm'
import EditCommunity from './components/editCommunityForm'
import Titlebar from '../titlebar'
import Stepper from './components/stepper'
import { Login } from '../../views/login'
import { getCommunityByIdQuery } from '../../graphql/queries/community/getCommunity'
import type { GetCommunityType } from '../../graphql/queries/community/getCommunity'
import getCurrentUserSettings from '../../graphql/queries/user/getCurrentUserSettings'
import type { GetCurrentUserSettingsType } from '../../graphql/queries/user/getCurrentUserSettings'
import {
  Actions,
  Container,
  Title,
  Description,
  Divider,
  ContentContainer
} from './style'
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../../components/viewNetworkHandler'