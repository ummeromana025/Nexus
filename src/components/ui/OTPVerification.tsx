import React, { useState, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface OTPVerificationProps {
  onVerify: () => void;
  onCancel: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ onVerify, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    // Mock verification - any 6 digits work
    onVerify();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
        <div className="w-14 h-14 bg-highlight-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={28} className="text-highlight-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Two-Factor Verification</h2>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          Enter the 6-digit code sent to your registered device
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-500"
            />
          ))}
        </div>

        {error && <p className="text-error-600 text-sm mb-4">{error}</p>}

        <p className="text-xs text-gray-500 mb-6">
          Didn't receive a code? <button className="text-highlight-600 font-medium hover:underline">Resend</button>
        </p>

        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="highlight" fullWidth onClick={handleSubmit}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};