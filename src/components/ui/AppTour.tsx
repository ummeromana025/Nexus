import React, { useState, useEffect } from 'react';
import { Joyride, Step, CallBackProps, STATUS } from 'react-joyride';

export const AppTour: React.FC = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: '.tour-dashboard',
      content: 'This is your Dashboard — discover startups or investors here.',
      
    },
    {
      target: '.tour-calendar',
      content: 'Schedule meetings and manage your availability here.',
    },
    {
      target: '.tour-videocall',
      content: 'Start video calls directly with your connections.',
    },
    {
      target: '.tour-documents',
      content: 'Upload, review, and e-sign deal documents in the Document Chamber.',
    },
    {
      target: '.tour-payments',
      content: 'Manage your wallet, deposits, withdrawals, and deal funding here.',
    },
  ];

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: '#9333EA',
          zIndex: 10000,
        },
      }}
    />
  );
};