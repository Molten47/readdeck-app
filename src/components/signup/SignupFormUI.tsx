import React from 'react';
import FormInput from '../ui/FormInput';
import FormButton from '../ui/FormButton';
import ErrorAlert from '../ui/ErrorAlert';
import '../../styles/auth.css';

interface SignupFormUIProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  formErrors: Partial<Record<string, string>>;
  loading: boolean;
  error: string | null;
  success: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SignupFormUI: React.FC<SignupFormUIProps> = ({
  formData, formErrors, loading, error, success, handleChange, handleSubmit,
}) => (
  <div className="auth-container">

    {/* Left — brand */}
 {/* Left — brand */}
<div className="auth-brand">
  <div className="auth-brand__inner">
    <h1 className="auth-brand__title">
      Read<span>deck</span>
    </h1>
    <p className="auth-brand__tagline">The DoorDash for books</p>
    <div className="auth-brand__decoration">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</div>

    {/* Right — form */}
    <div className="auth-form-panel">
      <div className="auth-form-wrap">

        <h2 className="auth-form-title">Create account</h2>
        <p className="auth-form-subtitle">Start your Readdeck journey today</p>

        {error && <ErrorAlert message={error} />}
        {success && <ErrorAlert message="Account created! Redirecting..." type="success" />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            error={formErrors.username}
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={formErrors.email}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 chars, uppercase & number"
            required
            error={formErrors.password}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            required
            error={formErrors.confirmPassword}
          />
          <FormButton type="submit" loading={loading} disabled={loading}>
            Create Account
          </FormButton>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login">Sign in</a>
        </p>

      </div>
    </div>

  </div>
);

export default SignupFormUI;