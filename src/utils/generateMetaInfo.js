import draft from './draft'
import truncate from './truncate'
import striptags from 'striptags'

const DEFAULT_META = {
  title: 'Xlab',
  description: 'Where community lives'
}

const HIDE_FROM_CRAWLERS = '<meta name="robots" content="noindex, nofollow">'

type MaybeMeta = {
  title?: string,
  description?: string,
  extra?: string
}
type Meta = {
  title: string,
  description: string,
  extra: string
}
type OtherInput = {
  type?: string,
  data?: void
}
type ThreadInput = {
  type: 'thread',
  data?: { title: string, body?: ?string, communityName?: string, privateChannel?: ?boolean, type?: ?string }
}
type UserInput = {
  type: 'user',
  data?: { name: string, username: string, description?: string }
}
type ChannelInput = {
  type: 'channel',
  data?: { name: string, description?: string, communityName?: string, private?: ?boolean }
}
type CommunityInput = {
  type: 'community',
  data?: { name: string, description?: string }
}
type DirectMessageInput = {
  type: 'directMessage',
  data?: { title: string, description?: string }
}
type Input =
  | ThreadInput
  | UserInput
  | ChannelInput
  | CommunityInput
  | OtherInput
  | DirectMessageInput

function setDefault (input: MaybeMeta): Meta {
  const title = input.title || DEFAULT_META.title
  var description = input.description || DEFAULT_META.description
  if (input.title && !input.description) {
    description = 'on xlab, ' + DEFAULT_META.description.toLowerCase()
  }
  return {
    title: title,
    description: cleanDescription(description),
    extra: input.extra || ''
  }
}

function cleanDescription (input: string): string {
  return truncate(striptags(input), 160)
}

function generateMetaInfo (input: Input): Meta {
  const exists = input || {}
  const type = exists.type
  const data = exists.data
  switch (type) {
    case 'explore': {
      return {
        title: 'Explore · Xlab',
        description: 'Explore some of the communities on xlab'
      }
    }
    case 'thread': {
      if (data.privateChannel) {
        return setDefault({
          extra: HIDE_FROM_CRAWLERS
        })
      }
      var body =
        data &&
        data.body &&
        (data.type === 'DRAFTJS'
          ? draft.toPlainText(draft.toState(JSON.parse(data.body)))
          : data.body)
      return setDefault({
        title: data && data.title + ' · ' + data.communityName,
        description: body
      })
    }
    case 'user': {
      return setDefault({
        title: data && data.name + ' (@' + data.username + ')',
        description: data && data.description
      })
    }
    case 'channel': {
      if (data.private) {
        return setDefault({
          extra: HIDE_FROM_CRAWLERS
        })
      }
      return setDefault({
        title: data && data.communityName + ' · ' + data.name,
        description: data && data.description
      })
    }
    case 'community': {
      return setDefault({
        title: data && data.name,
        description: data && data.description
      })
    }
    case 'directMessage': {
      return setDefault({
        title: data && data.title,
        description: data && data.description
      })
    }
    default: {
      return DEFAULT_META
    }
  }
}

module.exports = generateMetaInfo
