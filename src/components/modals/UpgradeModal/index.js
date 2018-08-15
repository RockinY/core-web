// @flow
import * as React from 'react'
import compose from 'recompose/compose';
import Modal from 'react-modal'
import ModalContainer from '../modalContainer'
import { closeModal } from '../../../actions/modals'
import { connect } from 'react-redux'
import { Button, OutlineButton } from '../../buttons'
import type { Dispatch } from 'redux'
import {
  modalStyles,
  Section,
  SectionActions,
  SectionError,
  Subheading,
  Padding,
} from './style';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  user: Object,
};

type State = {
  isOpen: boolean,
  upgradeError: string,
  isLoading: boolean,
};

class UpgradeModal extends React.Component<Props, State> {
  // $FlowFixMe
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      upgradeError: '',
      isLoading: false,
    };
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    const { user } = this.props;
    const { upgradeError, isOpen, isLoading } = this.state;

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
          hello
        </ModalContainer>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

// $FlowFixMe
export default compose(connect(mapStateToProps))(UpgradeModal);
