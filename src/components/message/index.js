// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openGallery } from '../../actions/gallery';
import Reaction from '../reaction';
import { Body, Actions } from './view';
import { Wrapper } from './style';
import { openModal } from '../../actions/modals';
import { replyToMessage } from '../../actions/message';

import type { Dispatch } from 'redux';
import type { MessageInfoType } from '../../graphql/fragments/message/messageInfo';
import type { UserInfoType } from '../../graphql/fragments/user/userInfo';

type Props = {
  message: MessageInfoType,
  threadId: string,
  threadType: string,
  selectedId: string,
  dispatch: Dispatch<Object>,
  canModerate: boolean,
  currentUser: UserInfoType,
  me: boolean,
  reaction?: $PropertyType<MessageInfoType, 'reactions'>,
  toggleReaction: Function,
  context?: 'notificition',
  changeSelection: Function,
  pending: boolean,
};

class Message extends Component<Props> {
  shouldComponentUpdate(nextProps, nextState) {
    const newMessage = nextProps.message.id !== this.props.message.id;
    const newSelection = nextProps.selectedId !== this.props.selectedId;

    if (newMessage || newSelection) {
      return true;
    } else {
      return false;
    }
  }

  toggleOpenGallery = messageId => {
    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, messageId));
  };

  deleteMessage = () => {
    const message = '你确定想要删除这条信息吗?';

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: this.props.message.id,
        entity: 'message',
        message,
        threadType: this.props.threadType,
        threadId: this.props.threadId,
      })
    );
  };

  replyToMessage = () => {
    const { threadId, message } = this.props;
    return this.props.dispatch(
      replyToMessage({
        threadId,
        messageId: message.id,
      })
    );
  };

  render() {
    const {
      canModerate,
      currentUser,
      dispatch,
      me,
      message,
      reaction,
      toggleReaction,
      context,
      selectedId,
      changeSelection,
      pending,
    } = this.props;

    const actionable = context !== 'notification';
    return (
      <Wrapper
        me={me}
        selected={selectedId === message.id}
        onClick={() => changeSelection && changeSelection(message.id)}
        data-cy="message"
      >
        <Body
          me={me}
          openGallery={() => this.toggleOpenGallery(message.id)}
          message={message}
        />
        {actionable && (
          <Actions
            me={me}
            currentUser={currentUser}
            canModerate={canModerate}
            deleteMessage={this.deleteMessage}
            replyToMessage={this.replyToMessage}
            isOptimisticMessage={pending}
            message={message}
          >
            {reaction && (
              <Reaction
                message={message}
                toggleReaction={toggleReaction}
                me={me}
                currentUser={currentUser}
                dispatch={dispatch}
                reaction={reaction}
              />
            )}
          </Actions>
        )}
      </Wrapper>
    );
  }
}

export default compose(connect())(Message);
