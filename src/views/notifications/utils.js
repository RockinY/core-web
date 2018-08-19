import React from 'react';
import Link from '../../components/link';
import { timeDifferenceShort } from '../../utils/timeDifference';
import { Timestamp } from './style';

export const parseNotification = notification => {
  return Object.assign({}, notification, {
    actors: notification.actors.map(actor => {
      return {
        id: actor.id,
        type: actor.type,
        payload: JSON.parse(actor.payload),
      };
    }),
    context: {
      id: notification.context.id,
      type: notification.context.type,
      payload: JSON.parse(notification.context.payload),
    },
    entities: notification.entities.map(entity => {
      return {
        id: entity.id,
        type: entity.type,
        payload: JSON.parse(entity.payload),
      };
    }),
  });
};

const actorsToString = actors => {
  // reverse to show the most recent first
  const names =
    actors &&
    actors.length > 0 &&
    actors.map(actor => actor.payload.name).reverse();
  const data =
    actors && actors.length > 0 && actors.map(actor => actor.payload).reverse();

  if (actors.length === 1) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>{`${names[0]}`}</Link>
      </span>
    );
  } else if (actors.length === 2) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>{`${names[0]}`}</Link> and{' '}
        <Link to={`/users/${data[1].username}`}>{`${names[1]}`}</Link>
      </span>
    );
  } else if (actors.length === 3) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>{`${names[0]}`}</Link>
        , <Link to={`/users/${data[1].username}`}>
          {`${names[1]}`}
        </Link> and{' '}
        <Link to={`/users/${data[2].username}`}>{`${names[2]}`}</Link>
      </span>
    );
  } else if (actors.length >= 4) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>{`${names[0]}`}</Link> and{' '}
        {names.length - 1} others{' '}
      </span>
    );
  } else {
    return null;
  }
};

const actorsToObjects = actors => {
  return (
    actors &&
    actors.length > 0 &&
    actors
      .map(actor => {
        return {
          name: actor.payload.name,
          username: actor.payload.username,
          profilePhoto: actor.payload.profilePhoto,
          id: actor.payload.id,
        };
      })
      .reverse()
  );
};

export const parseActors = (actors, currentUser, removeCurrentUser) => {
  let filteredActors = actors;
  if (removeCurrentUser) {
    filteredActors = actors.filter(actor => actor.id !== currentUser.id);
  }
  const asString = actorsToString(filteredActors);
  const asObjects = actorsToObjects(filteredActors);

  return {
    asString,
    asObjects,
  };
};

export const parseEvent = event => {
  switch (event) {
    case 'MESSAGE_CREATED': {
      return <span>回复了</span>;
    }
    case 'THREAD_REACTION_CREATED':
    case 'REACTION_CREATED': {
      return <span>点赞了</span>;
    }
    case 'CHANNEL_CREATED': {
      return <span>创建了新的频道</span>;
    }
    case 'USER_JOINED_COMMUNITY': {
      return <span>加入了</span>;
    }
    case 'PRIVATE_CHANNEL_REQUEST_SENT': {
      return <span>请求加入频道</span>;
    }
    case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
      return <span>同意了你的频道加入请求</span>;
    }
    case 'PRIVATE_COMMUNITY_REQUEST_SENT': {
      return <span>请求加入社区</span>;
    }
    case 'PRIVATE_COMMUNITY_REQUEST_APPROVED': {
      return <span>同意了你的社区加入请求</span>;
    }
    default: {
      console.error('Not a valid event type');
    }
  }
};

// parse date => modifiedAt to timeAgo
export const parseNotificationDate = date => {
  const now = new Date().getTime();
  const timestamp = new Date(date).getTime();
  return <Timestamp>· {timeDifferenceShort(now, timestamp)}</Timestamp>;
};

const threadToString = (context, currentUser) => {
  const isAuthor = context.payload.creatorId === currentUser.id;
  const str = isAuthor ? '你的话题' : '';
  return (
    <span>
      {' '}
      {str}{' '}
      <Link
        to={{
          pathname: window.location.pathname,
          search: `?thread=${context.payload.id}`,
        }}
      >
        {context.payload.content.title}
      </Link>
    </span>
  );
};

const threadReactionToString = context => {
  const str = '你的话题';
  return (
    <span>
      {' '}
      {str}{' '}
      <Link
        to={{
          pathname: window.location.pathname,
          search: `?thread=${context.payload.id}`,
        }}
      >
        {context.payload.content.title}
      </Link>
    </span>
  );
};

const messageToString = () => {
  return <span>你的回复</span>;
};

const communityToString = context => {
  return (
    <span>
      {' '}
      <Link to={`/${context.payload.slug}`}>{context.payload.name}</Link>
    </span>
  );
};

const channelToString = context => {
  return <span> {context.payload.name}</span>;
};

export const parseContext = (context, currentUser) => {
  switch (context.type) {
    case 'SLATE':
    case 'THREAD': {
      const asString = threadToString(context, currentUser);
      return {
        asString,
      };
    }
    case 'MESSAGE': {
      const asString = messageToString(context);
      return {
        asString,
      };
    }
    case 'COMMUNITY': {
      const asString = communityToString(context);
      return {
        asString,
      };
    }
    case 'CHANNEL': {
      const asString = channelToString(context);
      return {
        asString,
      };
    }
    case 'THREAD_REACTION': {
      const asString = threadReactionToString(context);
      return {
        asString,
      };
    }
    default: {
      console.error('Invalid notification context type');
    }
  }
};
