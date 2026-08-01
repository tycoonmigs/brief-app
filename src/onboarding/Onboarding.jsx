// src/onboarding/Onboarding.jsx
import { useState } from 'react';
import onboardingSteps from './onboardingSteps.js';
import Footer from '../components/Footer.jsx';

const ONBOARDING_KEY = 'brief_onboarding_complete';

const Onboarding = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onFinish();
  };

  const handleNext = () => {
    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      finish();
    }
  };

  const step = onboardingSteps[stepIndex];
  const isLastStep = stepIndex === onboardingSteps.length - 1;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card fade-in-up">
        <h2>{step.title}</h2>
        <p>{step.description}</p>

        <div className="onboarding-progress">
          {onboardingSteps.map((_, i) => (
            <span key={i} className={`progress-dot ${i === stepIndex ? 'active' : ''}`} />
          ))}
        </div>

        <div className="onboarding-actions">
          <button onClick={finish} className="skip-btn">skip</button>
          <button onClick={handleNext} className="btn-glow next-btn">
            {isLastStep ? 'get started' : 'next'}
          </button>
        </div>
      </div>
      <div className="onboarding-footer-wrap">
        <Footer />
      </div>
    </div>
  );
};

export default Onboarding;

export const hasCompletedOnboarding = () => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};