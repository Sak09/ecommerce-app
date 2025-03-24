import React from 'react'
import logo from '../assest/logo.jpg'
import { styled } from '@mui/material/styles';

const Logo = () => {
  const StyledLogo = styled('img')(({ theme }) => ({
    width: '150px',
    height: 'auto',
   
  }));
  
  return (
    <div>
        <StyledLogo src={logo}></StyledLogo>
      
    </div>
  )
}

export default Logo
