import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundColor: '#0F0C09', color: '#F5F0E8' }}
      className="min-h-screen flex flex-col items-center justify-center gap-6"
    >
      <div className="text-center">
        <p
          style={{ color: '#E8622A' }}
          className="text-8xl font-black mb-4"
        >
          404
        </p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p style={{ color: '#8A7968' }} className="text-sm">
          The page you're looking for doesn't exist.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        style={{ backgroundColor: '#E8622A' }}
        className="px-6 py-2.5 rounded-lg text-white
          font-semibold transition duration-200 hover:opacity-90"
      >
        Go home
      </button>
    </div>
  );
};

export default NotFoundPage;