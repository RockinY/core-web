// @flow
import * as React from 'react';
import { Text } from './style';

type Props = {
  me: boolean,
};

class MessageErrorFallback extends React.Component<Props> {
  render() {
    const { me } = this.props;

    return (
      <Text me={me} error>
        获取信息失败，不过请放心，云社团队已经知晓错误且正在全力修复中.
      </Text>
    );
  }
}

export default MessageErrorFallback;
