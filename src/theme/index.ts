'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#58a6ff', // Original --accent-color
        },
        secondary: {
            main: '#8b949e', // Original --text-secondary
        },
        background: {
            default: '#0d1117', // Original --bg-color
            paper: '#161b22', // Original --card-bg
        },
        text: {
            primary: '#c9d1d9', // Original --text-primary
            secondary: '#8b949e', // Original --text-secondary
        },
        success: {
            main: '#238636', // Original --success-color
        },
        error: {
            main: '#da3633', // Original --danger-color
        },
        divider: '#30363d', // Original --border-color
    },
    typography: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        h1: {
            fontSize: '2.25rem',
            fontWeight: 800,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        button: {
            textTransform: 'none', // Prevents forced uppercase on buttons
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // Matches original cards border-radius (12px)
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    // Apply the original background gradient and min-height
                    backgroundImage: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                    color: '#c9d1d9',
                },
            },
        },
        MuiCard: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    background: '#161b22',
                    border: '1px solid #30363d',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Original --premium-shadow
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                        borderColor: '#58a6ff',
                    },
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '8px 22px',
                    fontWeight: 600,
                    letterSpacing: '-0.1px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-1.5px)',
                    },
                    '&:active': {
                        transform: 'translateY(0) scale(0.97)',
                    },
                },
                containedPrimary: {
                    background: 'rgba(88, 166, 255, 0.12)',
                    border: '1px solid rgba(88, 166, 255, 0.25)',
                    color: '#58a6ff',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                        background: 'rgba(88, 166, 255, 0.2)',
                        border: '1px solid rgba(88, 166, 255, 0.45)',
                        boxShadow: '0 4px 30px rgba(88, 166, 255, 0.25)',
                    },
                },
                containedSuccess: {
                    background: 'rgba(46, 160, 67, 0.12)',
                    border: '1px solid rgba(46, 160, 67, 0.25)',
                    color: '#3fb950',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                        background: 'rgba(46, 160, 67, 0.22)',
                        border: '1px solid rgba(46, 160, 67, 0.45)',
                        boxShadow: '0 4px 30px rgba(46, 160, 67, 0.25)',
                    },
                },
                containedError: {
                    background: 'rgba(248, 81, 73, 0.12)',
                    border: '1px solid rgba(248, 81, 73, 0.25)',
                    color: '#f85149',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                        background: 'rgba(248, 81, 73, 0.22)',
                        border: '1px solid rgba(248, 81, 73, 0.45)',
                        boxShadow: '0 4px 30px rgba(248, 81, 73, 0.25)',
                    },
                },
                outlinedPrimary: {
                    borderColor: 'rgba(88, 166, 255, 0.25)',
                    color: '#58a6ff',
                    backgroundColor: 'rgba(88, 166, 255, 0.03)',
                    '&:hover': {
                        borderColor: '#58a6ff',
                        backgroundColor: 'rgba(88, 166, 255, 0.08)',
                    },
                },
            },
        },
    },
});

export default theme;
