// @flow
import * as React from 'react'
import compose from 'recompose/compose';
import Modal from 'react-modal'
import ModalContainer from '../modalContainer'
import { closeModal } from '../../../actions/modals'
import { connect } from 'react-redux'
import { Button } from '../../buttons'
import getPaymentPlans from '../../../graphql/queries/user/getCurrentUserPaymentPlans'
import payWithAlipay from '../../../graphql/mutations/payment/payWithAlipay'
import type { Dispatch } from 'redux'
import { LoadingModal } from '../../loading'
import {
  modalStyles,
  PaymentPlanSelector,
  PaymentPlanOption,
  PaymentPlanOptionLabel,
  PaymentPlanOptionBody,
  PaymentButtonsContainer
} from './style';

type Props = {
  dispatch: Dispatch<Object>,
  payWithAlipay: Function,
  isOpen: boolean,
  user: Object,
  data: Object
};

type State = {
  isOpen: boolean,
  selectedPlanIndex: number
};

type paymentMethod = 'alipay'

class UpgradeModal extends React.Component<Props, State> {
  // $FlowFixMe
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      selectedPlanIndex: 0
    };
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  handlePlanSwitch = (index) => {
    this.setState({selectedPlanIndex: index})
  }

  handlePaymentClick = (method: paymentMethod) => {
    const { data, payWithAlipay } = this.props;
    const { selectedPlanIndex } = this.state;
    const paymentPlans = data.user ? data.user.paymentPlans : []
    const selectedPlan = paymentPlans[selectedPlanIndex]

    if (selectedPlan && method === 'alipay') {
      payWithAlipay(selectedPlan.id)
        .then((data) => {
          const payemntUrl = data.data.payWithAlipay
          window.location.href = payemntUrl
        })
    }
  }

  render() {
    console.log(this.props);
    
    const { data } = this.props;
    const { isOpen, selectedPlanIndex } = this.state;
    const paymentPlans = data.user ? data.user.paymentPlans : []

    if (data.loading && !data.user) {
      return (
        <LoadingModal />
      )
    }

    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={true}
          closeModal={this.closeModal}
        >
          <PaymentPlanSelector>
            {paymentPlans.map((plan, index) => (
              <PaymentPlanOption
                selected={index === selectedPlanIndex}
                onClick={() => this.handlePlanSwitch(index)}
              >
                <PaymentPlanOptionLabel>
                  <input
                    type='radio'
                    checked={index === selectedPlanIndex}
                  />
                </PaymentPlanOptionLabel>
                <PaymentPlanOptionBody>
                  {`${plan.duration}天会员期限充值 - ${plan.price / 100}元`}
                </PaymentPlanOptionBody>
              </PaymentPlanOption>
            ))}
          </PaymentPlanSelector>

          <PaymentButtonsContainer>
            <Button
              icon={'alipay'}
              gradientTheme={'social.alipay'}
              onClick={() => this.handlePaymentClick('alipay')}
            >
              支付宝支付
            </Button>
          </PaymentButtonsContainer>
        </ModalContainer>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen
});

// $FlowFixMe
export default compose(
  connect(mapStateToProps),
  getPaymentPlans,
  payWithAlipay
)(UpgradeModal);
