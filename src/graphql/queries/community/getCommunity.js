import gql from 'graphql-tag'
import communityInfoFragment from '../../fragments/community/communityInfo'
import communityMetaDataFragment from '../../fragments/community/communityMetaData'
import type { CommunityInfoType } from '../../fragments/community/communityInfo'
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData'

export type GetCommunityType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>
}

export const getCommunityBySlugQuery = gql`
  query getCommunityBySlug($slug: LowercaseString) {
    community(slug: $slug) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`

export const getCommunityByIdQuery = gql`
  query getCommunityById($id: ID) {
    community(id: $id) {
      ...communityInfo,
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`
