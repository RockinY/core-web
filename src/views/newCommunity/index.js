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
import CreateCommunityForm from './components/CreateCommunityForm'