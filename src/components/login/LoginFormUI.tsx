import React from 'react';
import FormInput from '../ui/FormInput';
import FormButton from '../ui/FormButton';
import ErrorAlert from '../ui/ErrorAlert';
import '../../styles/auth.css';

interface LoginFormUIProps {
  formData: {
    email: string;
    password: string;
  };
  formErrors: Partial<Record<string, string>>;
  loading: boolean;
  error: string | null;
  success: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginFormUI: React.FC<LoginFormUIProps> = ({
  formData, formErrors, loading, error, success, handleChange, handleSubmit,
}) => (
  <div className="auth-container">

    {/* Left — brand */}
    <div className="auth-brand">
      <div className="auth-brand__inner">
        <h1 className="auth-brand__title">
          Read<span>deck</span>
        </h1>
        <p className="auth-brand__tagline">The DoorDash for books</p>
      </div>
    </div>

    {/* Right — form */}
    <div className="auth-form-panel">
      <div className="auth-form-wrap">

        <h2 className="auth-form-title">Welcome back</h2>
        <p className="auth-form-subtitle">Sign in to your Readdeck account</p>

        {error && <ErrorAlert message={error} />}
        {success && <ErrorAlert message="Login successful! Redirecting..." type="success" />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Enter your password"
            required
            error={formErrors.password}
          />
          <FormButton type="submit" loading={loading} disabled={loading}>
            Sign In
          </FormButton>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <a href="/signup">Create one</a>
        </p>

      </div>
    </div>

  </div>
);

export default LoginFormUI;