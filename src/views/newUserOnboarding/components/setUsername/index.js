// @flow
import * as React from 'react';
import slugg from 'slugg';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { Error, Success } from '../../../../components/formElements';
import UsernameSearch from '../../../../components/usernameSearch';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { Form, Row, InputLabel, InputSubLabel } from './style';
import editUserMutation from '../../../../graphql/mutations/user/editUser';
import { ContinueButton } from '../../style';
import type { Dispatch } from 'redux';

type Props = {
  client: Object,
  editUser: Function,
  save: Function,
  dispatch: Dispatch<Object>,
  user: ?Object,
};

type State = {
  username: string,
  error: string,
  success: string,
  isLoading: boolean,
};

class SetUsername extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { user } = props;

    // try to intelligently suggest a starting username based on the
    // person's name, or firstname/lastname
    let username = user
      ? user.name
        ? slugg(user.name)
        : user.firstName && user.lastName
          ? `${user.firstName}-${user.lastName}`
          : ''
      : '';

    this.state = {
      username: username,
      error: '',
      success: '',
      isLoading: false,
    };
  }

  handleUsernameValidation = ({ error, success, username }) => {
    this.setState({
      error,
      success,
      username,
    });
  };

  saveUsername = e => {
    e.preventDefault();
    const { username } = this.state;

    this.setState({
      isLoading: true,
    });

    const input = {
      username,
    };

    this.props
      .editUser(input)
      .then(() => {
        this.setState({
          isLoading: false,
          success: '',
        });

        // trigger a method in the newUserOnboarding component class
        // to determine what to do next with this user - either push them
        // to community discovery or close the onboarding completely
        return this.props.save();
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          success: '',
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { username, isLoading, error, success } = this.state;

    return (
      <Form onSubmit={this.saveUsername}>
        <InputLabel>创建你的用户名</InputLabel>
        <InputSubLabel>别紧张，你可以随时修改你的用户名!</InputSubLabel>

        <Row>
          {/* $FlowFixMe */}
          <UsernameSearch
            placeholder={'设置一个用户名...'}
            autoFocus={true}
            username={username}
            onValidationResult={this.handleUsernameValidation}
          />
        </Row>
        <Row>
          <Error>{error ? error : <span>&nbsp;</span>}</Error>

          <Success>{success ? success : <span>&nbsp;</span>}</Success>
        </Row>

        <Row>
          <ContinueButton
            onClick={this.saveUsername}
            disabled={!username || error}
            loading={isLoading}
          >
            保存然后继续
          </ContinueButton>
        </Row>
      </Form>
    );
  }
}

// $FlowFixMe
export default compose(editUserMutation, withApollo, connect())(SetUsername);
