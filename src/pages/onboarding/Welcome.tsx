import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeScreen from '@/components/onboarding/creator/WelcomeScreen';
import { useAuth } from '@/context/AuthContext';

const Welcome: React.FC = () => {
  const { user, setCurrentOnboardingStep } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset onboarding step to 1 when visiting welcome page
    setCurrentOnboardingStep(1);
    
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate, setCurrentOnboardingStep]);

  // Continue rendering the existing WelcomeScreen component
  return <WelcomeScreen />;
};

export default Welcome;
