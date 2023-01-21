import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { history } from '../helpers';
import NavBar from '../components/layout/NavBar';

function PrivateRoute({ children }) {
  const { user: authUser } = useSelector((state) => state.auth);

  if (!authUser) {
    return <Navigate to="/signin" state={{ from: history.location }} />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default PrivateRoute;
