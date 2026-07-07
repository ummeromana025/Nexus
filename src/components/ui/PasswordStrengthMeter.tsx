import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const getStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-error-500' };
  if (score <= 3) return { score, label: 'Medium', color: 'bg-warning-500' };
  return { score, label: 'Strong', color: 'bg-success-500' };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const { score, label, color } = getStrength(password);
  const percentage = Math.min((score / 5) * 100, 100);

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={`text-xs mt-1 font-medium ${
        label === 'Weak' ? 'text-error-600' : label === 'Medium' ? 'text-warning-600' : 'text-success-600'
      }`}>
        Password strength: {label}
      </p>
    </div>
  );
};