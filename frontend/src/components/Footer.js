import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Ecommerce App. Built for responsive browsing.
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        <Link href="#" underline="hover" color="inherit">
          Privacy
        </Link>
        <Link href="#" underline="hover" color="inherit">
          Terms
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
