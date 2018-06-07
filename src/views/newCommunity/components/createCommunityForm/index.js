import React from 'react'
import Link from '../../components/link'
import { connect } from 'react-redux'
import slugg from 'slugg'
import { withApollo } from 'react-apollo'
import { Notice } from '../../../../components/listItems/style'
import Avatar from '../../../../components/avatar'
import { throttle } from '../../../../helpers/utils'
import { addToastWithTimeout } from '../../../../actions/toasts'
import { COMMUNITY_SLUG_BLACKLIST } from '../../../../utils/slugBlacklists'
import createCommunityMutation from '../../../../graphql/mutations/community/createCommunity'
import type { CreateCommunityType } from '../../../../graphql/mutations/community/createCommunity'
import { getCommunityBySlugQuery } from '../../../../graphql/queries/community/getCommunity'
import { Button } from '../../../../components/buttons'
