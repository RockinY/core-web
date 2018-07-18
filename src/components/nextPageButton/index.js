// @flow
import React from 'react';
import { Spinner } from '../globals';
import { HasNextPage, NextPageButton } from './style';

type Props = {
  isFetchingMore?: boolean,
  fetchMore: () => any,
};

const NextPageButtonWrapper = (props: Props) => {
  const { isFetchingMore, fetchMore } = props;
  return (
    <HasNextPage>
      <NextPageButton loading={isFetchingMore} onClick={() => fetchMore()}>
        {isFetchingMore ? (
          <Spinner size={16} color={'brand.default'} />
        ) : (
          '加载之前得消息'
        )}
      </NextPageButton>
    </HasNextPage>
  );
};

export default NextPageButtonWrapper;
