// @flow
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const getPaymentPlans = gql`
  query getPaymentPlans {
    user: currentUser {
      id
      paymentPlans {
        id
        displayName
        price
        duration
      }
    }
  }
`

export default graphql(getPaymentPlans, {
  options: { fetchPolicy: 'cache-and-network' }
})