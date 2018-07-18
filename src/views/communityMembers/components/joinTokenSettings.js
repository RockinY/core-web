// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunitySettings, {
  type GetCommunitySettingsType,
} from '../../../graphql/queries/community/getCommunitySettings';
import Clipboard from 'react-clipboard.js';
import { Loading } from '../../../components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../../../components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from '../../../components/settingsViews/style';
import LoginTokenToggle from './joinTokenToggle';
import ResetJoinToken from './resetJoinToken';
import { Input } from '../../../components/formElements';
import { addToastWithTimeout } from '../../../actions/toasts';
import { TokenInputWrapper } from '../style';
import { CLIENT_URL } from '../../../constants';

type Props = {
  data: {
    community: GetCommunitySettingsType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class JoinTokenSettings extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  render() {
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const { joinSettings } = community;

      return (
        <SectionCard data-cy="login-with-token-settings">
          <SectionTitle>通过链接加入社区</SectionTitle>
          <SectionSubtitle>
            允许用户通过链接加入这个社区，任何拥有这个链接的人都可以加入这个社区
          </SectionSubtitle>

          <LoginTokenToggle settings={joinSettings} id={community.id} />

          {joinSettings.tokenJoinEnabled && (
            <Clipboard
              style={{ background: 'none' }}
              data-clipboard-text={`${CLIENT_URL}/${community.slug}/join/${
                joinSettings.token
              }`}
              onSuccess={() =>
                this.props.dispatch(
                  addToastWithTimeout('success', '已保存到剪切板')
                )
              }
            >
              <TokenInputWrapper>
                <Input
                  value={`${CLIENT_URL}/${community.slug}/join/${
                    joinSettings.token
                  }`}
                  onChange={() => {}}
                  dataCy={'join-link-input'}
                />
              </TokenInputWrapper>
            </Clipboard>
          )}

          {joinSettings.tokenJoinEnabled && (
            <ResetJoinToken id={community.id} />
          )}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(getCommunitySettings, viewNetworkHandler, connect())(
  JoinTokenSettings
);
