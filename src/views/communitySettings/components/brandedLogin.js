// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  getCommunityById,
  type GetCommunityType,
} from '../../../graphql/queries/community/getCommunity';
import { Loading } from '../../../components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../../../components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import BrandedLoginToggle from './brandedLoginToggle';
import Link from '../../../components/link';
import { Button, OutlineButton } from '../../../components/buttons';
import { TextArea, Error } from '../../../components/formElements';
import saveBrandedLoginSettings from '../../../graphql/mutations/community/saveBrandedLoginSettings';
import { addToastWithTimeout } from '../../../actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  saveBrandedLoginSettings: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  messageValue: ?string,
  messageLengthError: boolean,
  isLoading: boolean,
};

class BrandedLogin extends React.Component<Props, State> {
  state = {
    messageValue: null,
    messageLengthError: false,
    isLoading: false,
  };

  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (!prevProps.data.community && curr.data.community) {
      return this.setState({
        messageValue: curr.data.community.brandedLogin.message,
      });
    }
  }

  handleChange = e => {
    return this.setState({
      messageValue: e.target.value,
      messageLengthError: e.target.value.length > 280 ? true : false,
    });
  };

  saveCustomMessage = e => {
    e.preventDefault();
    const { messageValue } = this.state;

    if (messageValue && messageValue.length > 280) {
      return this.setState({
        messageLengthError: true,
      });
    }

    this.setState({
      isLoading: true,
    });

    return this.props
      .saveBrandedLoginSettings({
        message: messageValue,
        id: this.props.data.community.id,
      })
      .then(() => {
        this.setState({ messageLengthError: false, isLoading: false });
        return this.props.dispatch(addToastWithTimeout('success', '已保存!'));
      })
      .catch(err => {
        this.setState({ messageLengthError: false, isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { data: { community }, isLoading } = this.props;
    const { messageLengthError } = this.state;

    if (community) {
      const { brandedLogin } = community;
      return (
        <SectionCard data-cy="community-settings-branded-login">
          <SectionTitle>品牌登陆</SectionTitle>
          <SectionSubtitle>
            显示一条定制的登陆信息如果用户直接从你社区的主页进行注册
          </SectionSubtitle>

          <BrandedLoginToggle settings={brandedLogin} id={community.id} />

          <form onSubmit={this.saveCustomMessage}>
            {brandedLogin.isEnabled && (
              <TextArea
                defaultValue={brandedLogin.message}
                placeholder={'给登陆页面定制一条信息'}
                onChange={this.handleChange}
                dataCy="community-settings-branded-login-input"
              />
            )}

            {messageLengthError && (
              <Error>
                定制的登陆信息应该不应该超过200个字符.
              </Error>
            )}

            {brandedLogin.isEnabled && (
              <SectionCardFooter
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'flex-start',
                }}
              >
                <Button
                  style={{ alignSelf: 'flex-start', marginLeft: '8px' }}
                  onSubmit={this.saveCustomMessage}
                  onClick={this.saveCustomMessage}
                  disabled={messageLengthError}
                  loading={this.state.isLoading}
                  data-cy="community-settings-branded-login-save"
                >
                  保存
                </Button>

                <Link
                  to={`/${community.slug}/login`}
                  style={{ marginRight: '8px' }}
                >
                  <OutlineButton
                    color={'text.alt'}
                    style={{ alignSelf: 'flex-start' }}
                    data-cy="community-settings-branded-login-preview"
                  >
                    预览
                  </OutlineButton>
                </Link>
              </SectionCardFooter>
            )}
          </form>
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

export default compose(
  getCommunityById,
  viewNetworkHandler,
  // $FlowFixMe
  saveBrandedLoginSettings,
  connect()
)(BrandedLogin);
