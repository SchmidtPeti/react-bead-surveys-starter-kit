import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue color
    },
    secondary: {
      main: '#dc004e', // Red color
    },
    background: {
      default: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#fff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          width: '100%',
          display: 'inherit',
        },
        '#root': {
          height: '100%',
          width: '100%',
        },
        '.App': {
          height: '100%',
          width: '100%',
        },
        '.MuiContainer-root': {
          height: '100%',
        },
      },
    },
  },
});

export default theme;
