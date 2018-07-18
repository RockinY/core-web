// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Link from '../../../components/link';
import editChannelMutation from '../../../graphql/mutations/channel/editChannel';
import type { EditChannelType } from '../../../graphql/mutations/channel/editChannel';
import type { GetChannelType } from '../../../graphql/queries/channel/getChannel';
import deleteChannelMutation from '../../../graphql/mutations/channel/deleteChannel';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { Notice } from '../../../components/listItems/style';
import { Button, IconButton } from '../../../components/buttons';
import { NullCard } from '../../../components/upsell';
import {
  Input,
  UnderlineInput,
  TextArea,
} from '../../../components/formElements';
import {
  SectionCard,
  SectionTitle,
} from '../../../components/settingsViews/style';
import {
  Form,
  TertiaryActionContainer,
  Description,
  Actions,
  GeneralNotice,
  Location,
} from '../../../components/editForm/style';
import type { Dispatch } from 'redux';

type State = {
  name: string,
  slug: string,
  description: ?string,
  isPrivate: boolean,
  channelId: string,
  channelData: Object,
  isLoading: boolean,
};

type Props = {
  editChannel: Function,
  dispatch: Dispatch<Object>,
  channel: GetChannelType,
};
class ChannelWithData extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { channel } = this.props;

    this.state = {
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      isPrivate: channel.isPrivate || false,
      channelId: channel.id,
      channelData: channel,
      isLoading: false,
    };
  }

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;
    const { isPrivate } = this.state;

    const newState = {};
    // checkboxes should reverse the value
    if (key === 'isPrivate') {
      newState[key] = !isPrivate;
    } else {
      newState[key] = value;
    }

    this.setState(prevState => {
      return Object.assign({}, prevState, {
        ...newState,
      });
    });
  };

  save = e => {
    e.preventDefault();
    const { name, slug, description, isPrivate, channelId } = this.state;
    const input = {
      name,
      slug,
      description,
      isPrivate,
      channelId,
    };

    this.setState({
      isLoading: true,
    });

    // if privacy changed in this edit
    if (this.props.channel.isPrivate !== isPrivate) {
    }

    this.props
      .editChannel(input)
      .then(({ data }: EditChannelType) => {
        const { editChannel: channel } = data;

        this.setState({
          isLoading: false,
        });

        // the mutation returns a channel object. if it exists,
        if (channel !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', '频道已保存!'));
        }
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  triggerDeleteChannel = (e, channelId) => {
    e.preventDefault();
    const { name, channelData } = this.state;
    const message = (
      <div>
        <p>
          你确定你想删除{' '}
          <b>
            {channelData.community.name}/{name}
          </b>
          ?
        </p>
        {channelData.metaData.threads > 0 && (
          <p>
            这个频道下面的<b>{channelData.metaData.threads}话题</b>将会被删除.
          </p>
        )}
        <p>
          所有这个频道下面的消息, 反馈和图片都会被删除.
        </p>
        <p>
          <b>这个操作不可逆.</b>
        </p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: channelId,
        entity: 'channel',
        message,
        redirect: `/${channelData.community.slug}`,
      })
    );
  };

  render() {
    const { name, slug, description, isPrivate, isLoading } = this.state;
    const { channel } = this.props;

    if (!channel) {
      return (
        <NullCard
          bg="channel"
          heading={"这个频道不存在."}
          copy={'想创建一个吗?'}
        >
          {/* TODO: wire up button */}
          <Button>创建</Button>
        </NullCard>
      );
    } else {
      return (
        <SectionCard>
          <Location>
            <Link to={`/${channel.community.slug}/${channel.slug}`}>
              浏览频道
            </Link>
          </Location>
          <SectionTitle>频道设置</SectionTitle>
          <Form onSubmit={this.save}>
            <Input
              defaultValue={name}
              id="name"
              onChange={this.handleChange}
              dataCy="channel-name-input"
            >
              名字
            </Input>
            <UnderlineInput defaultValue={slug} disabled>
              {`URL: /${channel.community.slug}/`}
            </UnderlineInput>
            <TextArea
              id="description"
              defaultValue={description}
              onChange={this.handleChange}
              dataCy="channel-description-input"
            >
              描述
            </TextArea>

            {/* {slug !== 'general' &&
              <Checkbox
                id="isPrivate"
                checked={isPrivate}
                onChange={this.handleChange}
              >
                Private channel
              </Checkbox>} */}
            {isPrivate ? (
              <Description>
                只有被审核通过的用户才能浏览相关话题，消息和频道成员. 你可以手动审核并选择
                哪些用户可以加入你的频道.
              </Description>
            ) : (
              <Description>
                云社上的任何成员都可以加入你的频道并在上面发布话题和消息，同时频道的成员也是
                对外公开的. 如果你相创建私人频道请先注册会员.
              </Description>
            )}

            {// if the user is moving from private to public
            this.props.channel.isPrivate &&
              !isPrivate && (
                <Notice>
                  当一个私有频道公开的时候，频道下面所有等待审核的用户都会自动审核成功并
                  成为频道下会员. 被屏蔽的用户仍然会处于屏蔽状态. 但是之后任何新的云社
                  成员都将可以自由加入频道.
                </Notice>
              )}

            <Actions>
              <Button
                onClick={this.save}
                loading={isLoading}
                dataCy="save-button"
              >
                Save
              </Button>
              {slug !== 'general' && (
                <TertiaryActionContainer>
                  <IconButton
                    glyph="delete"
                    tipText={`Delete ${name}`}
                    tipLocation="top-right"
                    color="text.placeholder"
                    hoverColor="warn.alt"
                    onClick={e => this.triggerDeleteChannel(e, channel.id)}
                    dataCy="delete-channel-button"
                  />
                </TertiaryActionContainer>
              )}
            </Actions>

            {slug === 'general' && (
              <GeneralNotice>
                通用频道是您社区的默认频道. 它们无法被删除和私有化，但是你仍然可以对它们进行
                名称和描述的修改.
              </GeneralNotice>
            )}
          </Form>
        </SectionCard>
      );
    }
  }
}

// $FlowFixMe
const Channel = compose(deleteChannelMutation, editChannelMutation, withRouter)(
  ChannelWithData
);
export default connect()(Channel);
