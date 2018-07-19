// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import deleteCommunityMutation from '../../../graphql/mutations/community/deleteCommunity';
import type { DeleteCommunityType } from '../../../graphql/mutations/community/deleteCommunity';
import deleteChannelMutation from '../../../graphql/mutations/channel/deleteChannel';
import type { DeleteChannelType } from '../../../graphql/mutations/channel/deleteChannel';
import deleteThreadMutation from '../../../graphql/mutations/thread/deleteThread';
import type { DeleteThreadType } from '../../../graphql/mutations/thread/deleteThread';
import deleteMessage from '../../../graphql/mutations/message/deleteMessage';
import type { DeleteMessageType } from '../../../graphql/mutations/message/deleteMessage';
import archiveChannel from '../../../graphql/mutations/channel/archiveChannel';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles } from '../styles';
import { Actions, Message } from './style';
import type { Dispatch } from 'redux';

/*
  Generic component that should be used to confirm any 'delete' action.
  Takes modalProps as an object with four fields:

  entity => represents the table for lookup in the backend. Currently can
  be either 'thread', 'channel', or 'community'

  id => id of the entity to be deleted

  message => components can construct a custom confirmation message

  redirect => optional => string which represents the path a user should return
  too after deleting a thing (e.g. '/foo/bar')
*/
type State = {
  isLoading: boolean,
};

type Props = {
  dispatch: Dispatch<Object>,
  modalProps: {
    id: string,
    entity: string,
    redirect?: ?string,
    message?: ?string,
    buttonLabel?: string,
    extraProps?: Object,
  },
  deleteMessage: Function,
  deleteCommunity: Function,
  deleteThread: Function,
  deleteChannel: Function,
  archiveChannel: Function,
  dispatch: Dispatch<Object>,
  isOpen: boolean,
};

class DeleteDoubleCheckModal extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  triggerDelete = () => {
    const { modalProps: { id, entity, redirect }, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    switch (entity) {
      case 'message':
        return this.props
          .deleteMessage(id)
          .then(({ data }: DeleteMessageType) => {
            const { deleteMessage } = data;
            if (deleteMessage) {
              dispatch(addToastWithTimeout('neutral', '消息易删除.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `很抱歉，我们无法删除这条消息. ${err.message}`
              )
            );
          });
      case 'thread': {
        return this.props
          .deleteThread(id)
          .then(({ data }: DeleteThreadType) => {
            const { deleteThread } = data;
            if (deleteThread) {
              // TODO: When we figure out the mutation reducers in apollo
              // client we can just history push and trust the store to update
              // eslint-disable-next-line
              window.location.href = redirect ? redirect : '/';
              // history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', '话题已删除.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `很抱歉，我们无法删除这个话题. ${err.message}`
              )
            );
          });
      }
      case 'channel': {
        return this.props
          .deleteChannel(id)
          .then(({ data }: DeleteChannelType) => {
            const { deleteChannel } = data;
            if (deleteChannel) {
              // TODO: When we figure out the mutation reducers in apollo
              // client we can just history push and trust the store to update
              // eslint-disable-next-line
              window.location.href = redirect ? redirect : '/';
              // history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', '频道已删除.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `很抱歉，我们无法删除改频道. ${err.message}`
              )
            );
          });
      }
      case 'community': {
        return this.props
          .deleteCommunity(id)
          .then(({ data }: DeleteCommunityType) => {
            const { deleteCommunity } = data;
            if (deleteCommunity) {
              // TODO: When we figure out the mutation reducers in apollo
              // client we can just history push and trust the store to update
              // eslint-disable-next-line
              window.location.href = redirect ? redirect : '/';
              // history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', '社区已删除.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `很抱歉，我们无法删除改社区. ${
                  err.message
                }`
              )
            );
            this.setState({
              isLoading: false,
            });
          });
      }
      case 'channel-archive': {
        return this.props
          .archiveChannel({ channelId: id })
          .then(() => {
            dispatch(addToastWithTimeout('neutral', '频道已归档'));
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
      }
      default: {
        this.setState({
          isLoading: false,
        });

        return dispatch(
          addToastWithTimeout(
            'error',
            '不明白您想删除哪个!'
          )
        );
      }
    }
  };

  render() {
    const { isOpen, modalProps: { message, buttonLabel } } = this.props;
    const styles = modalStyles();

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'你确定吗?'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'你确定吗?'} closeModal={this.close}>
          <Message>{message ? message : '你确定吗?'}</Message>

          <Actions>
            <TextButton onClick={this.close} color={'warn.alt'}>
              取消
            </TextButton>
            <Button
              loading={this.state.isLoading}
              color="warn"
              onClick={this.triggerDelete}
              dataCy={'delete-button'}
            >
              {buttonLabel || '删除'}
            </Button>
          </Actions>
        </ModalContainer>
      </Modal>
    );
  }
}

const DeleteDoubleCheckModalWithMutations = compose(
  deleteCommunityMutation,
  deleteChannelMutation,
  deleteThreadMutation,
  deleteMessage,
  archiveChannel,
  // $FlowFixMe
  withRouter
)(DeleteDoubleCheckModal);

const map = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

// $FlowIssue
export default connect(map)(DeleteDoubleCheckModalWithMutations);
