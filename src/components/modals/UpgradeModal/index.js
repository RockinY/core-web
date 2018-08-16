// @flow
import * as React from 'react'
import compose from 'recompose/compose';
import Modal from 'react-modal'
import ModalContainer from '../modalContainer'
import { closeModal } from '../../../actions/modals'
import { connect } from 'react-redux'
import { Button, OutlineButton } from '../../buttons'
import getPaymentPlans from '../../../graphql/queries/user/getCurrentUserPaymentPlans'
import type { Dispatch } from 'redux'
import {
  modalStyles,
  PaymentPlanSelector,
  PaymentPlanOption,
  PaymentPlanOptionLabel,
  PaymentPlanOptionBody
} from './style';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  user: Object,
  data: Object
};

type State = {
  isOpen: boolean,
  upgradeError: string,
  selectedPlanIndex: number
};

class UpgradeModal extends React.Component<Props, State> {
  // $FlowFixMe
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      upgradeError: '',
      selectedPlanIndex: 0
    };
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  handlePlanSwitch = (index) => {
    this.setState({selectedPlanIndex: index})
  }

  render() {
    console.log(this.props);
    
    const { user, data } = this.props;
    const { upgradeError, isOpen, selectedPlanIndex } = this.state;
    const paymentPlans = data.user ? data.user.paymentPlans : []

    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={
          !user.isPro ? '升级为会员' : '续费会员'
        }
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={!user.isPro}
          title={!user.isPro ? '升级为会员' : '续费会员'}
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
  getPaymentPlans
)(UpgradeModal);
