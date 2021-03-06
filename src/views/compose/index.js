import React from 'react';
import Composer from '../../components/composer';
import Titlebar from '../titlebar';
import { View } from './style';

const Compose = props => {
  return (
    <View>
      <Titlebar
        provideBack
        noComposer
        title={'新的对话'}
        style={{ gridArea: 'header' }}
      />
      <Composer style={{ gridArea: 'body' }} />
    </View>
  );
};

export default Compose;
