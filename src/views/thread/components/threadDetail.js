// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Link from '../../../components/link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getLinkPreviewFromUrl } from '../../../utils/utils';
import { timeDifference } from '../../../utils/timeDifference';
import { convertTimestampToDate } from '../../../utils/timeFormatting';
import isURL from 'validator/lib/isURL';
import { URL } from '../../../utils/regexps';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import setThreadLockMutation from '../../../graphql/mutations/thread/lockThread';
import ThreadByline from './threadByline';
import deleteThreadMutation from '../../../graphql/mutations/thread/deleteThread';
import editThreadMutation from '../../../graphql/mutations/thread/editThread';
import pinThreadMutation from '../../../graphql/mutations/community/pinCommunityThread';
import type { GetThreadType } from '../../../graphql/queries/thread/getThread';
import Editor from '../../../components/richTextEditor';
import { toJSON, toPlainText, toState } from '../../../utils/draft';
import Textarea from 'react-textarea-autosize';
import ActionBar from './actionBar';
import {
  ThreadTitle,
  ThreadWrapper,
  ThreadContent,
  ThreadHeading,
  Edited,
  ThreadSubtitle,
} from '../style';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from '../../../components/error';

const ENDS_IN_WHITESPACE = /(\s|\n)$/;

type State = {
  isEditing?: boolean,
  body?: any,
  title?: string,
  linkPreview?: ?Object,
  linkPreviewTrueUrl?: string,
  linkPreviewLength?: number,
  fetchingLinkPreview?: boolean,
  receiveNotifications?: boolean,
  isSavingEdit?: boolean,
  flyoutOpen?: ?boolean,
  error?: ?string,
  isLockingThread: boolean,
  isPinningThread: boolean,
};

type Props = {
  thread: GetThreadType,
  setThreadLock: Function,
  pinThread: Function,
  editThread: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  toggleEdit: Function,
};

class ThreadDetailPure extends React.Component<Props, State> {
  state = {
    isLockingThread: false,
    isPinningThread: false,
    isEditing: false,
    body: null,
    title: '',
    linkPreview: null,
    linkPreviewTrueUrl: '',
    fetchingLinkPreview: false,
    receiveNotifications: false,
    isSavingEdit: false,
    flyoutOpen: false,
    error: '',
    linkPreviewLength: 0,
  };

  // $FlowFixMe
  bodyEditor: any;
  titleTextarea: React.Node;

  setThreadState() {
    const { thread } = this.props;

    let rawLinkPreview =
      thread.attachments && thread.attachments.length > 0
        ? thread.attachments.filter(
            attachment =>
              attachment && attachment.attachmentType === 'linkPreview'
          )[0]
        : null;

    let cleanLinkPreview = rawLinkPreview && {
      attachmentType: rawLinkPreview.attachmentType,
      data: JSON.parse(rawLinkPreview.data),
    };

    this.setState({
      isEditing: false,
      body: toState(JSON.parse(thread.content.body)),
      title: thread.content.title,
      // $FlowFixMe
      linkPreview: rawLinkPreview ? cleanLinkPreview.data : null,
      linkPreviewTrueUrl:
        thread.attachments &&
        thread.attachments.length > 0 &&
        thread.attachments[0]
          ? thread.attachments[0].trueUrl
          : '',
      linkPreviewLength:
        thread.attachments && thread.attachments.length > 0 ? 1 : 0,
      fetchingLinkPreview: false,
      flyoutOpen: false,
      receiveNotifications: thread.receiveNotifications,
      isSavingEdit: false,
    });
  }

  componentWillMount() {
    this.setThreadState();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.thread &&
      this.props.thread &&
      prevProps.thread.id !== this.props.thread.id
    ) {
      this.setThreadState();
    }
  }

  threadLock = () => {
    const { setThreadLock, dispatch, thread } = this.props;
    const value = !thread.isLocked;
    const threadId = thread.id;

    this.setState({
      isLockingThread: true,
    });

    setThreadLock({
      threadId,
      value,
    })
      .then(({ data: { setThreadLock } }) => {
        this.setState({
          isLockingThread: false,
        });
        if (setThreadLock.isLocked) {
          return dispatch(addToastWithTimeout('neutral', '话题已锁定'));
        } else {
          return dispatch(addToastWithTimeout('success', '话题已解锁'));
        }
      })
      .catch(err => {
        this.setState({
          isLockingThread: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  triggerDelete = e => {
    e.preventDefault();
    const { thread, dispatch } = this.props;

    const threadId = thread.id;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner = thread.community.communityPermissions.isOwner;

    let message;

    if (isCommunityOwner && !thread.isAuthor) {
      message = `你即将删除另一个人的话题，作为社区 ${
        thread.community.name
      } 的主人, 你有权力对此操作. 同时话题的主人将会收到话题被删除的通知.`;
    } else if (isChannelOwner && !thread.isAuthor) {
      message = `你即将删除另一个人的话题，作为频道 ${
        thread.channel.name
      } 的主人, 你有权力对此操作. 同时话题的主人将会收到话题被删除的通知.`;
    } else if (thread.isAuthor) {
      message = '你确定想删除这个话题吗?';
    } else {
      message = '你确定想删除这个话题吗?';
    }

    return dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: threadId,
        entity: 'thread',
        message,
        extraProps: {
          thread,
        },
      })
    );
  };

  toggleEdit = () => {
    const { isEditing } = this.state;

    this.setState({
      isEditing: !isEditing,
    });

    this.props.toggleEdit();
  };

  saveEdit = () => {
    const { dispatch, editThread, thread } = this.props;
    const { linkPreview, linkPreviewTrueUrl, title, body } = this.state;
    const threadId = thread.id;

    if (!title || title.trim().length === 0) {
      dispatch(
        addToastWithTimeout('error', '请确保您的话题有一个不为空的标题!')
      );
      return;
    }

    this.setState({
      isSavingEdit: true,
    });

    const jsonBody = toJSON(body);

    const content = {
      title: title.trim(),
      body: JSON.stringify(jsonBody),
    };

    const attachments = [];
    if (linkPreview) {
      const attachmentData = JSON.stringify({
        ...linkPreview,
        trueUrl: linkPreviewTrueUrl,
      });
      attachments.push({
        attachmentType: 'linkPreview',
        data: attachmentData,
      });
    }

    // Get the images
    const filesToUpload = Object.keys(jsonBody.entityMap)
      .filter(
        key =>
          jsonBody.entityMap[key].type.toLowerCase() === 'image' &&
          jsonBody.entityMap[key].data.file
      )
      .map(key => jsonBody.entityMap[key].data.file);

    const input = {
      threadId,
      content,
      attachments,
      filesToUpload,
    };

    editThread(input)
      .then(({ data: { editThread } }) => {
        this.setState({
          isSavingEdit: false,
        });

        if (editThread && editThread !== null) {
          this.toggleEdit();
          return dispatch(addToastWithTimeout('success', '话题已被保存!'));
        } else {
          return dispatch(
            addToastWithTimeout(
              'error',
              "修改保存失败了，再尝试一下吧?"
            )
          );
        }
      })
      .catch(err => {
        this.setState({
          isSavingEdit: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  changeTitle = e => {
    const title = e.target.value;
    if (/\n$/g.test(title)) {
      this.bodyEditor.focus && this.bodyEditor.focus();
      return;
    }
    this.setState({
      title,
    });
  };

  changeBody = state => {
    this.listenForUrl(state);
    this.setState({
      body: state,
    });
  };

  listenForUrl = state => {
    const { linkPreview, linkPreviewLength } = this.state;
    if (linkPreview !== null) return;

    const lastChangeType = state.getLastChangeType();
    if (
      lastChangeType !== 'backspace-character' &&
      lastChangeType !== 'insert-characters'
    ) {
      return;
    }

    const text = toPlainText(state);

    if (!ENDS_IN_WHITESPACE.test(text)) return;

    const toCheck = text.match(URL);

    if (toCheck) {
      const len = toCheck.length;
      if (linkPreviewLength === len) return; // no new links, don't recheck

      let urlToCheck = toCheck[len - 1].trim();

      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      if (!isURL(urlToCheck)) return;
      this.setState({ fetchingLinkPreview: true });

      getLinkPreviewFromUrl(urlToCheck)
        .then(data => {
          return this.setState(prevState => ({
            linkPreview: { ...data, trueUrl: urlToCheck },
            linkPreviewTrueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
            error: null,
          }));
        })
        .catch(() => {
          this.setState({
            error:
              "啊哦, 该链接好像无法正常工作. 但是你仍然可以成功发布 👍",
            fetchingLinkPreview: false,
          });
        });
    }
  };

  removeLinkPreview = () => {
    this.setState({
      linkPreview: null,
      linkPreviewTrueUrl: '',
    });
  };

  togglePinThread = () => {
    const { pinThread, thread, dispatch } = this.props;
    const isPinned = thread.community.pinnedThreadId === thread.id;
    const communityId = thread.community.id;

    if (thread.channel.isPrivate) {
      return dispatch(
        addToastWithTimeout(
          'error',
          '只有公共频道的话题才可以被置顶.'
        )
      );
    }

    this.setState({
      isPinningThread: true,
    });

    return pinThread({
      threadId: thread.id,
      communityId,
      value: isPinned ? null : thread.id,
    })
      .then(() => {
        this.setState({
          isPinningThread: false,
        });
      })
      .catch(err => {
        this.setState({
          isPinningThread: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { currentUser, thread } = this.props;

    const {
      isEditing,
      linkPreview,
      body,
      fetchingLinkPreview,
      isSavingEdit,
      isLockingThread,
      isPinningThread,
    } = this.state;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);

    const editedTimestamp = thread.modifiedAt
      ? new Date(thread.modifiedAt).getTime()
      : null;

    return (
      <ThreadWrapper>
        <ThreadContent isEditing={isEditing}>
          {/* $FlowFixMe */}
          <ErrorBoundary fallbackComponent={null}>
            <ThreadByline author={thread.author} />
          </ErrorBoundary>

          {isEditing ? (
            <Textarea
              onChange={this.changeTitle}
              style={ThreadTitle}
              value={this.state.title}
              placeholder={'起一个标题吧...'}
              ref={c => {
                this.titleTextarea = c;
              }}
              autoFocus
              data-cy="thread-editor-title-input"
            />
          ) : (
            <ThreadHeading>{thread.content.title}</ThreadHeading>
          )}

          <ThreadSubtitle>
            <Link to={`/${thread.community.slug}`}>
              {thread.community.name}
            </Link>
            {thread.channel.slug !== 'general' && <span>/</span>}
            {thread.channel.slug !== 'general' && (
              <Link to={`/${thread.community.slug}/${thread.channel.slug}`}>
                {thread.channel.name}
              </Link>
            )}
            <span>{` · ${timestamp}`}</span>
          </ThreadSubtitle>

          {thread.modifiedAt && (
            <Edited>
              {'· '}(Edited{' '}
              {timeDifference(Date.now(), editedTimestamp).toLowerCase()})
            </Edited>
          )}

          {/* $FlowFixMe */}
          <Editor
            readOnly={!this.state.isEditing}
            state={body}
            onChange={this.changeBody}
            editorKey="thread-detail"
            placeholder="把你的想法写在这里..."
            showLinkPreview={true}
            editorRef={editor => (this.bodyEditor = editor)}
            version={2}
            linkPreview={{
              loading: fetchingLinkPreview,
              remove: this.removeLinkPreview,
              trueUrl: linkPreview && linkPreview.url,
              data: linkPreview,
            }}
          />
        </ThreadContent>

        <ErrorBoundary fallbackComponent={null}>
          <ActionBar
            toggleEdit={this.toggleEdit}
            currentUser={currentUser}
            thread={thread}
            saveEdit={this.saveEdit}
            togglePinThread={this.togglePinThread}
            isSavingEdit={isSavingEdit}
            threadLock={this.threadLock}
            triggerDelete={this.triggerDelete}
            isEditing={isEditing}
            title={this.state.title}
            isLockingThread={isLockingThread}
            isPinningThread={isPinningThread}
          />
        </ErrorBoundary>
      </ThreadWrapper>
    );
  }
}

const ThreadDetail = compose(
  setThreadLockMutation,
  deleteThreadMutation,
  editThreadMutation,
  pinThreadMutation,
  // $FlowFixMe
  withRouter
)(ThreadDetailPure);

const map = state => ({
  currentUser: state.users.currentUser,
  flyoutOpen: state.flyoutOpen,
});

// $FlowIssue
export default connect(map)(ThreadDetail);
