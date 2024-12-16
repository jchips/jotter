import { Navigate } from 'react-router';
import { getToken } from '../../util/authUtil';

/**
 * Wrapper for the private routes
 * If there's a currentUser, it displays the child element (the private route).
 * Otherwise, if there is no currentUser, it navigates to the login page.
 * @param {Object} {children} - (Prop) all the children components.
 * @param {Boolean} {inLoggedIn} - If the user is logged in or not.
 * @returns - Either a component or navigation to a component.
 */
const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
