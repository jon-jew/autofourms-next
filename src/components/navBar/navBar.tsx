"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';

import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';

import { UserContext } from '@/contexts/userContext';
import { logout } from '@/lib/firebase/auth';

import useUserSession from './useUserSesssion';
import Login from './login';
import './navBar.scss';

const logoColor = "#b81111";

function NavBar({ initialUser }) {
  // const { user } = useContext(UserContext);
  const user = useUserSession(initialUser);
  // console.log(initialUser, user)
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [loginModal, setLoginModal] = React.useState(false);

  const pages = [
    { title: 'Explore', href: '/explore' }
  ];

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseLoginModal = () => {
    setLoginModal(false);
    setAnchorElUser(null);
  }

  if (user)
    if (user !== null) pages.push({ title: 'My Garage', href: `/user-profile/${user.uid}` });

  return (
    <>
      <Modal disablePortal open={loginModal} onClose={handleCloseLoginModal}>
        <Login handleClose={handleCloseLoginModal} />
      </Modal>
      <AppBar sx={{ backgroundColor: '#FFF', }} position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* <TimeToLeaveIcon sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              color: logoColor,
            }} /> */}

            {/* <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                ml: 1,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'overpass',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: logoColor,
                textDecoration: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image className="logo" src="/icon.png" width={40} height={31} />
              <span>AUTOFOURMS</span>
            </Typography> */}

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <Link key={page.href} href={page.href}>
                    <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: 'center' }}>{page.title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            <Link href="/">
              <div className="logo-container">
                <Image className="logo" alt="logo" src="/icon.png" width={40} height={31} />
                <h1>AUTOFORUMS</h1>
              </div>
            </Link>
            {/* <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'overpass',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: logoColor,
                textDecoration: 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image className="logo" src="/icon.png" width={40} height={31} />
              <span>AUTOFOURMS</span>
            </Typography> */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link key={page.href} href={page.href}>
                  <Button
                    key={page.title}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'black', display: 'block' }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {user ?
                <>
                  <Tooltip title="User Options">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar>
                        <SportsMotorsportsIcon />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={logout}>
                      <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </> :
                <Button
                  onClick={() => setLoginModal(true)}
                  sx={{ my: 2, display: 'block' }}
                >
                  Login
                </Button>
              }
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBar;
