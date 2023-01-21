import { Box, Container, Paper, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <>
      <Box>
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
          <Paper
            elevation={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: 200,
              p: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Page Not Found
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
