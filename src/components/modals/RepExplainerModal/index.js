import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import Reputation from '../../reputation';
import Avatar from '../../avatar';
import Icon from '../../icons';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { connect } from 'react-redux';
import {
  modalStyles,
  Section,
  Title,
  Subtitle,
  Rep,
  IconContainer,
  RepWrapper,
} from './style';

type Props = {};
class RepExplainerModal extends React.Component<Props> {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    const { currentUser, isOpen, reputation } = this.props;

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'威望'}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={true}
          title={null}
          closeModal={this.closeModal}
        >
          <Section>
            <IconContainer>
              <Icon glyph={'rep'} size={64} />
            </IconContainer>
            <Title>云社威望</Title>
            <Subtitle>
              威望代表了一个人对社区得贡献值. 威望可以通过有效得对话交流获得.
            </Subtitle>

            {reputation <= 0 ? (
              currentUser ? (
                <Rep>
                  您还没有获得任何威望，试着和社区里得人进行一些互动来获取威望吧.
                </Rep>
              ) : (
                ''
              )
            ) : currentUser ? (
              <Rep>
                <Avatar
                  src={currentUser.profilePhoto}
                  user={currentUser}
                  size={24}
                />
                <RepWrapper>
                  <Reputation
                    tipText={'你的所有威望'}
                    reputation={currentUser.totalReputation}
                    ignoreClick
                  />
                </RepWrapper>
              </Rep>
            ) : (
              ''
            )}
          </Section>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  isOpen: state.modals.isOpen,
});
export default compose(connect(map))(RepExplainerModal);
