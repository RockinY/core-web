// @flow
import * as React from 'react';
import Icon from '../icons';
import { addToastWithTimeout } from '../../actions/toasts';
import { ReactionWrapper } from '../message/style';
import type { GetMessageType } from '../../graphql/queries/message/getMessage';
import type { Dispatch } from 'redux';

type Props = {
  toggleReaction: Function,
  dispatch: Dispatch<Object>,
  currentUser?: Object,
  me: boolean,
  message: GetMessageType,
};

type State = {
  count: number,
  hasReacted: boolean,
};

class Reaction extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      count: props.message.reactions.count,
      hasReacted: props.message.reactions.hasReacted,
    };
  }

  doNothing = () => {};

  triggerMutation = () => {
    const { toggleReaction, message, dispatch, currentUser } = this.props;

    if (!currentUser) {
      return dispatch(
        addToastWithTimeout('error', '请先登陆之后再进行操作!')
      );
    }

    const hasReacted = this.state.hasReacted;
    const count = this.state.count;

    this.setState({
      hasReacted: !hasReacted,
      count: hasReacted ? count - 1 : count + 1,
    });

    toggleReaction({
      messageId: message.id,
      type: 'like',
    })
      // after the mutation occurs, it will either return an error or the new
      // thread that was published
      .then(({ data }) => {
        // can do something with the returned reaction here
      })
      .catch(error => {
        // TODO add some kind of dispatch here to show an error to the user
        dispatch(
          addToastWithTimeout(
            'error',
            "操作失败了，再试一下吧?"
          )
        );

        this.setState({
          hasReacted,
          count,
        });
      });
  };

  render() {
    const { me, currentUser } = this.props;
    const { hasReacted, count } = this.state;

    return (
      <ReactionWrapper
        hasCount={count}
        hasReacted={hasReacted}
        me={me}
        hide={(me || !currentUser) && count === 0}
        onClick={me ? this.doNothing : this.triggerMutation}
        dummy={false}
      >
        <Icon
          glyph="like-fill"
          size={16}
          color={'text.reverse'}
          tipText={me ? '点赞' : hasReacted ? '取消点赞' : '点赞'}
          tipLocation={me ? 'top-left' : 'top-right'}
        />
        <span>{count}</span>
      </ReactionWrapper>
    );
  }
}

export default Reaction;
