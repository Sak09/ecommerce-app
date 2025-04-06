import React from 'react'
import logo from '../assets/logo.png'
import { styled } from '@mui/material/styles';

const Logo = () => {
  const StyledLogo = styled('img')(({ theme }) => ({
    width: '60px',
    height: 'auto',
   
  }));
  
  return (
    <div>
        <StyledLogo src={logo}></StyledLogo>
      
    </div>
  )
}

export default Logo
