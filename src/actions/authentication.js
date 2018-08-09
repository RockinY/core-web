import { removeItemFromStorage, storeItem } from '../utils/localStorage';
import { clearApolloStore } from '../graphql'

export const logout = dispatch => {
  // clear localStorage
  removeItemFromStorage('yunshe');

  // clear Apollo's query cache
  clearApolloStore();
  // redirect to home page
  window.location.href = '/auth/logout'

  dispatch({
    type: 'CLEAR_USER'
  });
};

export const saveUserDataToLocalStorage = (user: Object) => async dispatch => {
  const obj = {};

  if (!user) {
    logout();
  }
  // construct a clean object that doesn't include any metadata from apollo
  // like __typename
  obj['currentUser'] = {
    id: user.id,
    name: user.name,
    username: user.username,
    profilePhoto: user.profilePhoto,
    coverPhoto: user.coverPhoto,
    website: user.website,
    totalReputation: user.totalReputation,
  };


  // save this object to localstorage. This will be used in the future to hydrate
  // the store when users visit the homepage
  storeItem('yunshe', obj);

  // dispatch to the store and save the user
  dispatch({
    type: 'SET_USER',
    user,
  });
};
