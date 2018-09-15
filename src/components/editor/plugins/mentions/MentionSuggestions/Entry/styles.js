import styled from 'styled-components'
import { Truncate, zIndex } from '../../../../../globals'
import Avatar from '../../../../../avatar';


export const EntryText = styled.span`
  color: #FFF;
  font-size: 16px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
  width: 116px;
`

export const EntryWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 5px;
  width: 150px;
  background: ${props => props.isFocused ? '#172B4D' : '#36B37E' };
`

export const SuggestionWrapper = styled.div`
  border-radius: 5px;
  padding: 5px 0;
  margin-top: 5px;
  position: absolute;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: #36B37E;
  box-shadow: 0px 4px 30px 0px rgba(220,220,220,1);
  z-index: 5000;
`

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  z-index: ${zIndex.loading};
`;

export const SearchResultsDropdown = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  margin-top: 8px;
  display: inline-block;
  width: 160px;
  max-height: 420px;
  overflow-y: scroll;
  z-index: 6000;

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    border-radius: 0 0 8px 8px;
  }
`;

export const SearchResult = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #DFE7EF;
  background: ${props => (props.focused ? '#F5F8FC' : '#fff')};
  width: 100%;
  ${Truncate()} padding: 8px 16px 8px 8px;

  &:only-child {
    border-bottom: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.bg.wash};
    cursor: pointer;
  }
`;

export const SearchResultImage = styled(Avatar)`
  margin-right: 8px;
`;

export const SearchResultTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

export const SearchResultDisplayName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #16171A;
  line-height: 1.4;
`;

export const SearchResultUsername = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #828C99;
  line-height: 1.4;
`;

export const SearchResultNull = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #828C99;
`;
