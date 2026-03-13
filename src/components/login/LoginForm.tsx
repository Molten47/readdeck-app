import React from 'react';
import { useLoginForm } from './useLoginForm';
import LoginFormUI from './LoginFormUI';

const LoginForm: React.FC = () => {
  const form = useLoginForm();
  return <LoginFormUI {...form} />;
};

export default LoginForm;