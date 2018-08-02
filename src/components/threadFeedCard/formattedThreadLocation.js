import React from 'react';
// $FlowFixMe
import Link from '../link';
import Icon from '../icons';
import Avatar from '../avatar';
import {
  ThreadContext,
  ThreadContextAvatar,
  ThreadContextMeta,
  Location,
  Lock,
} from './style';

const FormattedThreadLocation = props => {
  const needsCommunityDetails =
    props.viewContext === 'dashboard' || props.viewContext === 'profile';

  const needsChannelDetails =
    props.viewContext === 'dashboard' ||
    props.viewContext === 'profile' ||
    props.viewContext === 'community';

  return (
    <ThreadContext>
      {needsCommunityDetails && (
        <ThreadContextAvatar>
          <Avatar
            community={props.data.community}
            size={20}
            radius={8}
            src={props.data.community.profilePhoto}
          />
        </ThreadContextAvatar>
      )}
      <ThreadContextMeta>
        {(needsCommunityDetails || needsChannelDetails) && (
          <Location>
            {needsCommunityDetails && (
              <Link to={`/${props.data.community.slug}`}>
                {props.data.community.name}
              </Link>
            )}
            {needsCommunityDetails &&
              needsChannelDetails && <span>{' / '}</span>}
            {needsChannelDetails && (
              <Link
                to={`/${props.data.community.slug}/${props.data.channel.slug}`}
              >
                {props.data.channel.isPrivate && (
                  <Lock>
                    <Icon
                      glyph="private"
                      tipText={'私人频道'}
                      tipLocation="top-right"
                      size={12}
                    />
                  </Lock>
                )}
                {props.data.channel.name}
              </Link>
            )}
          </Location>
        )}
      </ThreadContextMeta>
    </ThreadContext>
  );
};

export default FormattedThreadLocation;
