// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import FullscreenView from '../../components/fullscreenView';
import LoginButtonSet from '../../components/loginButtonSet';
import { Loading } from '../../components/loading';
import Avatar from '../../components/avatar';
import {
  Title,
  Subtitle,
  LoginImageContainer,
  FullscreenContent,
  CodeOfConduct,
} from './style';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../../components/viewNetworkHandler';
import {
  getCommunityByMatch,
  type GetCommunityType,
} from '../../graphql/queries/community/getCommunity';
import ViewError from '../../components/viewError';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  history: Object,
  location: Object,
  match: Object,
  redirectPath: ?string,
};

export class Login extends React.Component<Props> {
  escape = () => {
    this.props.history.push(`/${this.props.match.params.communitySlug}`);
  };

  render() {
    const { data: { community }, isLoading, redirectPath } = this.props;

    if (community && community.id) {
      const { brandedLogin } = community;

      return (
        <FullscreenView hasBackground noCloseButton={true} close={null}>
          <FullscreenContent
            data-cy="community-login-page"
            style={{ justifyContent: 'center' }}
          >
            <LoginImageContainer>
              <Avatar
                community={community}
                size={'88'}
                src={community.profilePhoto}
              />
            </LoginImageContainer>
            <Title>Sign in to the {community.name} community</Title>
            <Subtitle>
              {brandedLogin.message && brandedLogin.message.length > 0
                ? brandedLogin.message
                : '云社是新一代互联网的社区，登陆以开始探索吧.'}
            </Subtitle>

            <LoginButtonSet
              redirectPath={redirectPath || null}
              signinType={'signin'}
            />

            <CodeOfConduct>
              使用云社，您默认同意以下条款{' '}
              <a
                href="https://github.com/withspectrum/code-of-conduct"
                target="_blank"
                rel="noopener noreferrer"
              >
                使用条款
              </a>
            </CodeOfConduct>
          </FullscreenContent>
        </FullscreenView>
      );
    }

    if (isLoading) {
      return (
        <FullscreenView>
          <Loading />
        </FullscreenView>
      );
    }

    return (
      <FullscreenView close={this.escape}>
        <ViewError
          refresh
          heading={'该社区无法找到'}
          subheading={
            '再次检查这个社区是否存在或者试着刷新一下'
          }
        />
      </FullscreenView>
    );
  }
}

export default compose(getCommunityByMatch, viewNetworkHandler)(Login);
