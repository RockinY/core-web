import gql from 'graphql-tag'
import communityInfoFragment from '../../fragments/community/communityInfo'
import communityMetaDataFragment from '../../fragments/community/communityMetaData'

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
