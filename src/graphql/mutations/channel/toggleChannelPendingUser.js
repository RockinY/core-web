// @flow
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import channelInfoFragment from '../../fragments/channel/channelInfo'
import type { ChannelInfoType } from '../../fragments/channel/channelInfo'
import userInfoFragment from '../../fragments/user/userInfo'
import type { UserInfoType } from '../../fragments/user/userInfo'
import channelMetaDataFragment from '../../fragments/channel/channelMetaData'
import type { ChannelMetaDataType } from '../../fragments/channel/channelMetaData'
import { getChannelMemberConnectionQuery } from '../../queries/channel/getChannelMemberConnection'

type User = {
  ...$Exact<UserInfoType>,
};

export type ToggleChannelPendingUserType = {
  data: {
    togglePendingUser: {
      ...$Exact<ChannelInfoType>,
      pendingUsers: Array<?User>,
      blockedUsers: Array<?User>,
      channelMetaData: {
        ...$Exact<ChannelMetaDataType>,
      },
    },
  },
};

type TogglePendingInput = {
  channelId: string,
  userId: string,
  action: 'approve' | 'block',
};

export const toggleChannelPendingUserMutation = gql`
  mutation togglePendingUser($input: TogglePendingUserInput!) {
    togglePendingUser(input: $input) {
      ...channelInfo
      pendingUsers {
        ...userInfo
      }
      blockedUsers {
        ...userInfo
      }
      ...channelMetaData
    }
  }
  ${channelInfoFragment}
  ${userInfoFragment}
  ${channelMetaDataFragment}
`

const toggleChannelPendingUserOptions = {
  props: ({ mutate }) => ({
    togglePendingUser: (input: TogglePendingInput) =>
      mutate({
        variables: {
          input
        },
        // $FlowFixMe
        refetchQueries: [
          {
            query: getChannelMemberConnectionQuery,
            variables: {
              id: input.channelId
            }
          }
        ]
      })
  })
}

export default graphql(
  toggleChannelPendingUserMutation,
  toggleChannelPendingUserOptions
)
