// @flow
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const payWithAlipayMutation = gql`
  mutation payWithAlipay($input: AlipayInput!) {
    payWithAlipay(input: $input)
  }
`

const payWithAlipayMutationOptions = {
  // $FlowFixMe
  props: ({ ownProps, mutate }) => ({
    payWithAlipay: (paymentPlanId: string) => {
      return mutate({
        variables: {
          input: {
            paymentPlanId
          }
        }
      })
    }
  })
}

export default graphql(payWithAlipayMutation, payWithAlipayMutationOptions)