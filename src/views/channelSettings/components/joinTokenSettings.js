// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getChannelSettings, {
  type GetChannelSettingsType,
} from '../../../graphql/queries/channel/getChannelSettings';
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
import type { Dispatch } from 'redux';

type Props = {
  data: {
    channel: GetChannelSettingsType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  saveBrandedLoginSettings: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
};

class LoginTokenSettings extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  render() {
    const { data: { channel }, isLoading } = this.props;

    if (channel) {
      const { joinSettings } = channel;

      return (
        <SectionCard data-cy="login-with-token-settings">
          <SectionTitle>通过链接加入频道</SectionTitle>
          <SectionSubtitle>
            允许用户通过点击一个特定链接加入您的私人频道. 任何拥有这个特殊链接的人
            都将可以加入这个频道.
          </SectionSubtitle>

          <LoginTokenToggle settings={joinSettings} id={channel.id} />

          {joinSettings.tokenJoinEnabled && (
            <Clipboard
              style={{ background: 'none' }}
              data-clipboard-text={`${CLIENT_URL}/${channel.community.slug}/${
                channel.slug
              }/join/${joinSettings.token}`}
              onSuccess={() =>
                this.props.dispatch(
                  addToastWithTimeout('success', '已保存到剪切板')
                )
              }
            >
              <TokenInputWrapper>
                <Input
                  value={`${CLIENT_URL}/${channel.community.slug}/${
                    channel.slug
                  }/join/${joinSettings.token}`}
                  onChange={() => {}}
                  dataCy={'join-link-input'}
                />
              </TokenInputWrapper>
            </Clipboard>
          )}

          {joinSettings.tokenJoinEnabled && <ResetJoinToken id={channel.id} />}
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

export default compose(getChannelSettings, viewNetworkHandler, connect())(
  LoginTokenSettings
);
