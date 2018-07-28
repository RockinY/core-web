// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import FullscreenView from '../../components/fullscreenView';
import { UpsellCreateCommunity } from '../../components/upsell';
import SetUsername from './components/setUsername';
import JoinFirstCommunity from './components/joinFirstCommunity';
import TopCommunities from './components/discoverCommunities';
import {
  OnboardingContainer,
  OnboardingContent,
  IconContainer,
  Title,
  Subtitle,
  Emoji,
  Container,
  CreateUpsellContainer,
  StickyRow,
  ContinueButton,
} from './style';
import type { UserInfoType } from '../../graphql/fragments/user/userInfo';
import type { CommunityInfoType } from '../../graphql/fragments/community/communityInfo';

type StateProps = {|
  community: CommunityInfoType,
|};

type Props = StateProps & {|
  currentUser: UserInfoType,
  close: Function,
  noCloseButton: boolean,
|};

type ActiveStep = 'discoverCommunities' | 'setUsername' | 'joinFirstCommunity';

type State = {|
  activeStep: ActiveStep,
  joinedCommunities: number,
|};

class NewUserOnboarding extends Component<Props, State> {
  constructor(props) {
    super(props);

    const { currentUser } = this.props;

    this.state = {
      // if the user has a username already, we know that the onboarding
      // was triggered because the user has not joined any communities yet
      activeStep:
        currentUser && currentUser.username
          ? 'discoverCommunities'
          : 'setUsername',
      // we make sure to only let the user continue to their dashboard
      // if they have joined one or more communities - because it's possible
      // to join and then leave a community in this onboarding component,
      // we keep track of the total joined count with a number, rathern than
      // a boolean
      joinedCommunities: 0,
    };
  }
  //
  // shouldComponentUpdate(nextProps, nextState) {
  //   // don't reload the component as the user saves info
  //   if (!this.props.currentUser.username && nextProps.currentUser.username)
  //     return false;
  //
  //   return true;
  // }

  saveUsername = () => {
    const { community } = this.props;

    // if the user signed up via a community, channel, or thread view, the first
    // thing they will be asked to do is set a username. After they save their
    // username, they should proceed to the 'joinFirstCommunity' step; otherwise
    // we can just close the onboarding
    if (!community) return this.props.close();
    // if the user signed in via a comunity, channel, or thread view, but they
    // are already members of that community, we can escape the onboarding
    if (community.communityPermissions.isMember) return this.props.close();
    // if the user signed up via a community, channel, or thread view and
    // has not yet joined that community, move them to that step in the onboarding
    return this.toStep('joinFirstCommunity');
  };

  toStep = (step: ActiveStep) => {
    return this.setState({
      activeStep: step,
    });
  };

  joinedCommunity = (number: number, done: boolean) => {
    const { joinedCommunities } = this.state;
    // number will be either '1' or '-1' - so it will either increment
    // or decrement the joinedCommunities count in state
    let newCount = joinedCommunities + number;
    this.setState({ joinedCommunities: newCount });

    // if the user signed up from a community, channel, or thread view,
    // they will see an onboarding step to join that community they were
    // viewing in order to complete their onboarding. when they do join
    // that community, we pass a finish argument which will push them forward
    // in the onboarding flow
    if (done) {
      return this.props.close();
    }
  };

  render() {
    const { community, currentUser } = this.props;
    const { activeStep, joinedCommunities } = this.state;

    const steps = {
      setUsername: {
        title: '欢迎来到云社!',
        subtitle:
          '在云社你可以找到您感兴趣的内容和一群志同道合的人，但是首先请先留下您的用户名.',
        emoji: '👋',
      },
      joinFirstCommunity: {
        // will be triggered if the user signed up via a community, channel, or thread view
        title: '加入你的第一个社区',
        subtitle:
          "加入一个感兴趣的社区来开始这段奇妙的旅程吧!",
        emoji: '🎉',
      },
      discoverCommunities: {
        title: '找到你的朋友.',
        subtitle:
          '云社里面有着很多不同类型的社区，试着搜索一下，也许会有不一样的惊喜',
        emoji: null,
      },
    };

    return (
      <FullscreenView
        hasBackground
        showBackgroundOnMobile={false}
        close={this.props.close}
        noCloseButton={this.props.noCloseButton}
      >
        <OnboardingContainer>
          <OnboardingContent>
            <IconContainer>
              {steps[activeStep].emoji && (
                <Emoji>{steps[activeStep].emoji}</Emoji>
              )}
            </IconContainer>
            <Title>{steps[activeStep].title}</Title>
            <Subtitle>{steps[activeStep].subtitle}</Subtitle>

            {activeStep === 'setUsername' && (
              <SetUsername user={currentUser} save={this.saveUsername} />
            )}

            {activeStep === 'joinFirstCommunity' && (
              // $FlowFixMe
              <JoinFirstCommunity
                 // $FlowFixMe
                community={community}
                joinedCommunity={this.joinedCommunity}
              />
            )}

            {activeStep === 'discoverCommunities' && (
              <Container>
                <TopCommunities
                  joinedCommunity={this.joinedCommunity}
                  hasJoined={joinedCommunities > 0}
                  curatedContentType={'recommended'}
                />
                <CreateUpsellContainer extra={joinedCommunities > 0}>
                  <UpsellCreateCommunity close={this.props.close} />
                </CreateUpsellContainer>

                <StickyRow hasJoined={joinedCommunities > 0}>
                  <ContinueButton
                    style={{ marginTop: '0' }}
                    onClick={() => (window.location.href = '/')}
                  >
                    回到我的主页
                  </ContinueButton>
                </StickyRow>
              </Container>
            )}
          </OnboardingContent>
        </OnboardingContainer>
      </FullscreenView>
    );
  }
}

const map = (state): StateProps => ({
  community: state.newUserOnboarding.community,
});
export default compose(connect(map))(NewUserOnboarding);
