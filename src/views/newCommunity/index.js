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
import EditCommunityForm from './components/editCommunityForm'
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
  Description
} from './style'
import viewNetworkHandler, {
  type ViewNetworkHandlerType
} from '../../components/viewNetworkHandler'

type State = {
  activeStep: number,
  isLoading: boolean,
  community: any,
  existingId: ?string,
  hasInvitedPeople: boolean,
};

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  client: Object,
  history: Object,
  data: {
    user: ?GetCurrentUserSettingsType,
  },
}

class NewCommunity extends React.Component<Props, State> {
  constructor () {
    super()

    const parsed = queryString.parse(window.location.search)
    let step = parsed.s
    const id = parsed.id

    step = step ? parseInt(step, 10) : 1

    this.state = {
      activeStep: step,
      isLoading: false,
      community: null,
      existingId: id || null,
      hasInvitedPeople: false
    }
  }

  componentDidMount () {
    const { existingId } = this.state
    if (!existingId) return

    this.props.client
      .query({
        query: getCommunityByIdQuery,
        variables: {
          id: existingId
        }
      })
      .then(
        ({
          data: { community }
        }: {
          data: { community: GetCommunityType },
        }) => {
          if (!community) return
          return this.setState({
            community
          })
        }
      )
      .catch(err => {
        console.error('error creating community', err)
      })
  }

  step = direction => {
    const { activeStep, community } = this.state
    let newStep = direction === 'next' ? activeStep + 1 : activeStep - 1
    this.props.history.replace(
      `/new/community?s=${newStep}${community &&
        community.id &&
        `&id=${community.id}`}`
    )
    this.setState({
      activeStep: newStep
    })
  };

  title = () => {
    const { activeStep, community } = this.state
    switch (activeStep) {
      case 1: {
        return community ? '修改你的社区' : '创建一个社区'
      }
      case 2: {
        return `邀请朋友${
          community
            ? `加入社区 - ${community.name}`
            : '进入你的社区'
        }`
      }
      case 3: {
        return '完成!'
      }
      default: {
        return '创建一个社区'
      }
    }
  };

  description = () => {
    const { activeStep, community } = this.state
    switch (activeStep) {
      case 1: {
        return '在云社创建公有社区永远免费，首先请告诉我们你想创建一个什么样的社区.'
      }
      case 2: {
        return `开始为${
          community ? `社区 - ${community.name}` : '你的社区'
        }邀请一些朋友.`
      }
      case 3: {
        return "社区创建完成了，去你的社区里面发布一些内容吧!"
      }
      default: {
        return '创建一个社区'
      }
    }
  };

  communityCreated = community => {
    this.setState({
      community: { ...community }
    })
    this.props.history.replace(`/new/community?id=${community.id}`)
    return this.step('next')
  };

  hasInvitedPeople = () => {
    this.setState({
      hasInvitedPeople: true
    })
  };

  render () {
    const { isLoading, data: { user } } = this.props
    const { activeStep, community, hasInvitedPeople } = this.state
    const title = this.title()
    const description = this.description()
    if (user && user.email) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'创建一个社区'}
            provideBack
            backRoute={'/'}
            noComposer
          />

          <Column type='primary'>
            <Container bg={activeStep === 3 ? 'onboarding' : null} repeat>
              <Stepper activeStep={activeStep} />
              <Title centered={activeStep === 3}>{title}</Title>
              <Description centered={activeStep === 3}>
                {description}
              </Description>

              {// gather community meta info
                activeStep === 1 &&
                !community && (
                  <CreateCommunityForm
                    communityCreated={this.communityCreated}
                  />
                )}

              {activeStep === 1 &&
                community && (
                  <EditCommunityForm
                    communityUpdated={this.communityCreated}
                    community={community}
                  />
                )}

              {// connect a slack team or invite via email
                activeStep === 2 && (
                  <Actions>
                    <TextButton onClick={() => this.step('previous')}>
                    返回
                    </TextButton>
                    {hasInvitedPeople ? (
                      <Button onClick={() => this.step('next')}>Continue</Button>
                    ) : (
                      <TextButton
                        color={'brand.default'}
                        onClick={() => this.step('next')}
                      >
                      跳过这一步
                      </TextButton>
                    )}
                  </Actions>
                )}

            </Container>
          </Column>
        </AppViewWrapper>
      )
    }

    if (user && !user.email) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'创建一个社区'}
            provideBack
            backRoute={'/'}
            noComposer
          />

          <Column type='primary'>
            <Container bg={null}>
              <Title>
                {user.pendingEmail ? '确认' : '添加'}你的邮件地址
              </Title>
              <Description>
                创建社区之前, 请{' '}
                {user.pendingEmail ? '确认' : '添加'}你的邮件地址. 该邮件地址
                将会被用于发送更新提示和社区设置变更.
              </Description>
            </Container>
          </Column>
        </AppViewWrapper>
      )
    }

    if (isLoading) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'创建一个社区'}
            provideBack
            backRoute={'/'}
            noComposer
          />

          <Loading />
        </AppViewWrapper>
      )
    }

    return <Login redirectPath={`${window.location.href}`} />
  }
}

export default compose(
  withApollo,
  // $FlowIssue
  connect(),
  getCurrentUserSettings,
  viewNetworkHandler
)(NewCommunity)
