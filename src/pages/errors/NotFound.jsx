// src/pages/errors/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white opacity-80">404</h1>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-xl text-blue-100 mb-8 max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>

        {/* Footer Text */}
        <p className="text-blue-200 text-sm mt-12">
          © 2025 MIS Team - All Rights Reserved
        </p>
      </div>
    </div>
  );
}