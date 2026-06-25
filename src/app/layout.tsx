import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { Navbar } from '@/components/ui/Navbar';
import Box from '@mui/material/Box';

export const metadata = {
  title: 'Whatsit',
  description: 'A modern discussion and sharing platform',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={'en'}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            <Box component={'main'} py={4}>
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
