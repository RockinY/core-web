// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import type { GetChannelType } from '../../../graphql/queries/channel/getChannel';
import restoreChannel from '../../../graphql/mutations/channel/restoreChannel';
import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, Description } from '../styles';
import { Form, Actions } from './style';
import type { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  channel: GetChannelType,
  id: string,
  restoreChannel: Function,
};

type State = {
  isLoading: boolean,
  hasChargeableSource: boolean,
};

class RestoreChannelModal extends React.Component<Props, State> {
  state = { isLoading: false, hasChargeableSource: false };

  onSourceAvailable = () => this.setState({ hasChargeableSource: true });

  close = () => {
    this.props.dispatch(closeModal());
  };

  restore = () => {
    const { channel, dispatch } = this.props;

    return this.props
      .restoreChannel({ channelId: channel.id })
      .then(() => {
        dispatch(addToastWithTimeout('success', '频道已恢复'));
        this.setState({
          isLoading: false,
        });
        return this.close();
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { isOpen, channel } = this.props;
    const { isLoading, hasChargeableSource } = this.state;

    const styles = modalStyles(420);

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'创建一个新频道'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'恢复频道'} closeModal={this.close}>
          <Form>
            <Description>
              恢复一个私人频道需要您有会员得身份
            </Description>

            <Actions>
              <TextButton onClick={this.close} color={'warn.alt'}>
                取消
              </TextButton>
              <Button
                disabled={channel.isPrivate && !hasChargeableSource}
                loading={isLoading}
                onClick={this.restore}
              >
                恢复频道
              </Button>
            </Actions>
          </Form>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  isOpen: state.modals.isOpen,
});
export default compose(
  connect(map),
  // $FlowIssue
  restoreChannel
)(RestoreChannelModal);
