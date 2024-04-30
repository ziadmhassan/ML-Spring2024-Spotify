import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Material-UI blue
    },
    secondary: {
      main: '#f57c00', // Material-UI orange
    },
  },
  typography: {
    h1: {
      fontSize: '4rem',
      fontWeight: 700,
      marginBottom: '20px',
      textAlign: 'center',
      '@media (max-width: 600px)': {
        fontSize: '3rem',
      },
    },
    subtitle1: {
      fontSize: '1.2rem',
      marginBottom: '40px',
      textAlign: 'center',
      '@media (max-width: 600px)': {
        fontSize: '1rem',
        marginBottom: '20px',
      },
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'md',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'large',
      },
      variants: {
        contained: {
          borderRadius: 10,
          fontWeight: 500,
          '&:hover': {
            backgroundColor: '#2939b1',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

export default theme;

