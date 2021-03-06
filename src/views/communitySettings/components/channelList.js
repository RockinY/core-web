// @flow
import React from 'react';
import Link from '../../../components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { openModal } from '../../../actions/modals';
import { Loading } from '../../../components/loading';
import { ChannelListItem } from '../../../components/listItems';
import { IconButton, Button } from '../../../components/buttons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import getCommunityChannels from '../../../graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from '../../../graphql/queries/community/getCommunityChannelConnection';
import type { Dispatch } from 'redux';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  render() {
    const {
      data: { community },
      isLoading,
      dispatch,
      communitySlug,
    } = this.props;

    if (community) {
      const channels = community.channelConnection.edges.map(c => c && c.node);

      return (
        <SectionCard data-cy="channel-list">
          <SectionTitle>频道</SectionTitle>

          <ListContainer>
            {channels.length > 0 &&
              channels.map(item => {
                if (!item) return null;
                return (
                  <Link
                    key={item.id}
                    to={`/${communitySlug}/${item.slug}/settings`}
                  >
                    <ChannelListItem contents={item} withDescription={false}>
                      <IconButton glyph="settings" />
                    </ChannelListItem>
                  </Link>
                );
              })}
          </ListContainer>

          <SectionCardFooter>
            <Button
              style={{ alignSelf: 'flex-start' }}
              icon={'plus'}
              onClick={() =>
                dispatch(
                  openModal('CREATE_CHANNEL_MODAL', {
                    community,
                    id: community.id,
                  })
                )
              }
              data-cy="create-channel-button"
            >
              创建频道
            </Button>
          </SectionCardFooter>
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

    return (
      <SectionCard>
        <ViewError
          refresh
          small
          heading={'We couldn’t load the channels for this community.'}
        />
      </SectionCard>
    );
  }
}

export default compose(connect(), getCommunityChannels, viewNetworkHandler)(
  ChannelList
);
