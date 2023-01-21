import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

import { authActions } from '../../store';
import { history } from '../../helpers';

function NavBar() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  // only show nav when logged in
  if (!authUser) return null;

  const goHome = () => {
    history.navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar sx={{ pr: '24px', justifyContent: 'space-between' }}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={goHome}
            >
              Quiz Builder App
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 3 }}>
                {authUser.firstName} {authUser.lastName}
              </Typography>
              <Button color="inherit" onClick={logout}>
                <Typography variant="body2">{authUser ? 'Log out' : 'Login'}</Typography>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default NavBar;
