"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import CloseIcon from '@mui/icons-material/Close';

import { signIn, createUser } from '@/lib/firebase/auth';
import { FormTextField } from '@/components/formComponents';

import './login.scss';

const Login = ({ handleClose, handleToggle }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await signIn(data.email, data.password);
    if (res) handleClose();
  };

  return (
    <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', top: '5px', right: '10px' }}
      >
        <CloseIcon />
      </IconButton>
      <h2>Sign In</h2>
      <FormTextField
        control={control}
        type="email"
        label="Email"
        name="email"
      />
      <FormTextField
        control={control}
        type="password"
        label="Password"
        name="password"
      />
      <Button
        sx={{ marginTop: '5px' }}
        disableElevation
        size="small"
        variant="contained"
        type="submit"
      >
        Login
      </Button>
      <p>
        New User? <a onClick={handleToggle}>Create account</a>
      </p>
    </form>
  );
}

const SignUp = ({ handleClose, handleToggle }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password, username }) => {
    if (!errors) {
      const res = await createUser(email, password, username);
      if (res) handleClose();
    } else {
      toastError('Please fix errors in form');
    }
  };
  console.log(errors);

  return (
    <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', top: '5px', right: '10px' }}
      >
        <CloseIcon />
      </IconButton>
      <h2>Create Account</h2>
      <FormTextField
        control={control}
        label="User Name"
        name="username"
        rules={{
          required: true
        }}
      />
      <FormTextField
        control={control}
        type="email"
        label="Email"
        name="email"
        rules={{
          required: true
        }}
      />
      <FormTextField
        control={control}
        type="password"
        label="Password"
        name="password"
        rules={{
          required: true
        }}
      />
      <FormTextField
        control={control}
        type="password"
        label="Confirm Password"
        name="passwordConfirm"
        rules={{
          required: true,
          validate: {
            matchesPassword: (v) => v === watch("password")
          }
        }}
      />
      <Button
        sx={{ marginTop: '10px', marginBottom: '5px' }}
        disableElevation
        size="small"
        variant="contained"
        type="submit"
      >
        Create Account
      </Button>
      <a onClick={handleToggle}>
        Back
      </a>
    </form>
  );
}

const LoginPage = ({ handleClose }) => {
  const [createAccount, setCreateAccount] = useState(false);
  const handleToggle = () => setCreateAccount(!createAccount);

  return (
    <div className="login">
      {createAccount ?
        <SignUp handleClose={handleClose} handleToggle={handleToggle} /> :
        <Login handleClose={handleClose} handleToggle={handleToggle} />
      }
    </div>
  );
};

export default LoginPage;
