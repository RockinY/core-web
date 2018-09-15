import React from 'react';
import {
  SearchSpinnerContainer,
  SearchResult,
  SearchResultNull,
  SearchResultUsername,
  SearchResultDisplayName,
  SearchResultTextContainer,
  SearchResultImage,
} from './styles'

const defaultEntryComponent = (props) => {
  const {
    mention,
    isFocused,
    ...parentProps
  } = props;
  const user = mention

  return (
    <SearchResult
      focused={isFocused}
      {...parentProps}
    >
      <SearchResultImage
        user={user}
        isOnline={user.isOnline}
        size={32}
        radius={32}
        src={user.profilePhoto}
      />
      <SearchResultTextContainer>
        <SearchResultDisplayName>
          {user.name}
        </SearchResultDisplayName>
        {user.username && (
          <SearchResultUsername>
            @{user.username}
          </SearchResultUsername>
        )}
      </SearchResultTextContainer>
    </SearchResult>
  );
};

export default defaultEntryComponent;
