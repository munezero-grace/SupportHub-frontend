"use client";

import React from 'react';
import BPTicketLogin from './ClientLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginClientWrapper = () => {
  return (
    <>
      <BPTicketLogin />
      <ToastContainer />
    </>
  );
};

export default LoginClientWrapper;
