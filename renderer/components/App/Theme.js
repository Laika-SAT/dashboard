import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const titleStyles = {
  fontWeight: 'bold'
}

const Theme = createTheme({
  typography: {
    fontFamily: 'Helvetica',
    h1: {
      ...titleStyles,
    },
    h2: {
      ...titleStyles,
    },
    h3: {
      ...titleStyles
    },
    h4: {
      ...titleStyles,
    },
  },
  palette: {
    primary: {
      main: "#3C4FC7",
    },
    secondary: {
      main: '#fff',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: '#fff',
          '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
          },
          '& .MuiInputLabel-root': {
            color: '#fff'
          },
          '& .MuiInputBase-root': {
            color: '#fff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        },
        containedPrimary: {
          backgroundColor: '#6785F2',
          color: '#fff',
          textTransform: 'none',
          fontWeight: 'bold',
          '& :hover': {
            backgroundColor: '#fff'
          }
        },
        containedSecondary: {
          backgroundColor: '#2C2F75',
          color: '#fff',
          borderRadius: '50px',
          border: '1px solid #7D82F5',
          textTransform: 'none',
          fontWeight: 'bold',
          '& :hover': {
            backgroundColor: '#fff'
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          boxShadow: 'none',
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 0
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#444'
        }
      }
    }
  }
});

export default Theme;