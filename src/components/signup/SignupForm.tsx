import React from 'react';
import { useSignupForm } from './useSignupForm';
import SignupFormUI from './SignupFormUI';

const SignupForm: React.FC = () => {
  const form = useSignupForm();
  return <SignupFormUI {...form} />;
};

export default SignupForm;