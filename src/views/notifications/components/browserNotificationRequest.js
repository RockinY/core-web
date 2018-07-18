import React from 'react';
import { RequestCard, CloseRequest } from '../style';
import { FlexRow } from '../../../components/globals';
import { Button } from '../../../components/buttons';

const FirstRequest = ({ onSubscribe, onDismiss, loading }) => (
  <RequestCard>
    <p>
      <span role="img" aria-label="mailbox emoji">
        📬
      </span>{' '}
      我们需要你的授权来开启消息推送:
    </p>
    <FlexRow>
      <Button
        icon="notification-fill"
        gradientTheme={'success'}
        onClick={onSubscribe}
        loading={loading}
      >
        Enable
      </Button>
      <CloseRequest
        glyph="view-close"
        color="text.placeholder"
        hoverColor="warn.alt"
        tipText="Dismiss"
        tipLocation="top-left"
        onClick={onDismiss}
      />
    </FlexRow>
  </RequestCard>
);

const BrowserNotificationRequest = ({ onSubscribe, onDismiss, loading }) => (
  <FirstRequest
    onSubscribe={onSubscribe}
    onDismiss={onDismiss}
    loading={loading}
  />
);

export default BrowserNotificationRequest;
