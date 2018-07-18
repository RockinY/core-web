// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modals';
import { Button } from '../../../components/buttons';
import type { GetChannelType } from '../../../graphql/queries/channel/getChannel';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import type { Dispatch } from 'redux';

type Props = {
  channel: GetChannelType,
  dispatch: Dispatch<Object>,
};

class Channel extends React.Component<Props> {
  initArchiveChannel = () => {
    const { channel } = this.props;

    const message = (
      <div>
        <p>
          你确定想归档这个频道吗？社区成员将不能继续在这个频道下面发言.
        </p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: channel.id,
        entity: 'channel-archive',
        message,
        buttonLabel: '归档'
      })
    );
  };

  initRestoreChannel = () => {
    return this.props.dispatch(
      openModal('RESTORE_CHANNEL_MODAL', {
        channel: this.props.channel,
        id: this.props.channel.community.id,
      })
    );
  };

  render() {
    const { channel } = this.props;

    if (!channel.isArchived) {
      return (
        <SectionCard>
          <SectionTitle>归档频道</SectionTitle>
          {channel.isPrivate ? (
            <SectionSubtitle>
              归档私人频道会自动取消您对这个频道的订阅. 同时频道将处于只读状态，您的社区成员将无法
              在下面进行相关对话.
            </SectionSubtitle>
          ) : (
            <SectionSubtitle>
              归档频道之后频道将处于只读状态，您的社区成员将无法
              在下面进行相关对话.
            </SectionSubtitle>
          )}

          <SectionCardFooter>
            <Button onClick={this.initArchiveChannel}>归档频道</Button>
          </SectionCardFooter>
        </SectionCard>
      );
    } else {
      return (
        <SectionCard>
          <SectionTitle>
            恢复频道 {channel.isPrivate ? '· ¥10/每月' : ''}
          </SectionTitle>
          {channel.isPrivate ? (
            <SectionSubtitle>
              恢复一个私人频道需要您处于会员状态. 恢复之后频道将会恢复正常，您的成员也可以正常
              在里面进行交流.
            </SectionSubtitle>
          ) : (
            <SectionSubtitle>
              恢复之后频道将会恢复正常，您的成员也可以正常
              在里面进行交流.
            </SectionSubtitle>
          )}

          <SectionCardFooter>
            <Button onClick={this.initRestoreChannel}>恢复频道</Button>
          </SectionCardFooter>
        </SectionCard>
      );
    }
  }
}

export default compose(connect())(Channel);
