// @flow
import * as React from 'react';
import { Checkbox } from '../../../components/formElements';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import enableBrandedLoginMutation from '../../../graphql/mutations/community/enableBrandedLogin';
import disableBrandedLoginMutation from '../../../graphql/mutations/community/disableBrandedLogin';
import { addToastWithTimeout } from '../../../actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  id: string,
  settings: {
    isEnabled: boolean,
  },
  enableBrandedLogin: Function,
  disableBrandedLogin: Function,
  dispatch: Dispatch<Object>,
};

class BrandedLoginToggle extends React.Component<Props> {
  init = () => {
    return this.props.settings.isEnabled ? this.disable() : this.enable();
  };

  disable = () => {
    return this.props
      .disableBrandedLogin({ id: this.props.id })
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('neutral', '取消品牌登陆')
        );
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  enable = () => {
    return this.props
      .enableBrandedLogin({ id: this.props.id })
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('success', '开启品牌登陆')
        );
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isEnabled } = this.props.settings;

    return (
      <Checkbox checked={isEnabled} onChange={this.init}>
        开启定制品牌登陆
      </Checkbox>
    );
  }
}

export default compose(
  connect(),
  enableBrandedLoginMutation,
  // $FlowFixMe
  disableBrandedLoginMutation
)(BrandedLoginToggle);
