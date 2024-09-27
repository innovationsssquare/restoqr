"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the phone number to your backend
    // and trigger the OTP to be sent to the user
    console.log("Sending OTP to:", phoneNumber);
    setShowOTP(true);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(Number(element.target.value))) return false;

    setOtp([
      ...otp.map((d, idx) => (idx === index ? element.target.value : d)),
    ]);

    if (element.target.value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleOtpSubmit = () => {
    console.log("Verifying OTP:", otp.join(""));
    // Here you would verify the OTP with your backend
  };

  useEffect(() => {
    if (showOTP) {
      inputRefs[0].current.focus();
    }
  }, [showOTP]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Logo Placeholder */}
        <div className="w-24 h-24 mx-auto mb-8 bg-[#F04F5F] rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-white">LOGO</span>
        </div>

        {!showOTP ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Enter Your Phone Number
            </h2>
            <form onSubmit={handlePhoneSubmit}>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F04F5F] focus:border-[#F04F5F] mb-4"
                required
              />
              <Button
                type="submit"
                className="w-full bg-[#F04F5F] hover:bg-[#E03F4F] text-white font-bold py-3 rounded-lg transition duration-300"
              >
                Send OTP
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Enter OTP
            </h2>
            <p className="text-center text-gray-600 mb-8">
              We've sent a one-time password to {phoneNumber}
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpBackspace(e, index)}
                  ref={inputRefs[index]}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#F04F5F] focus:ring-[#F04F5F]"
                />
              ))}
            </div>
            <Button
              className="w-full bg-[#F04F5F] hover:bg-[#E03F4F] text-white font-bold py-3 rounded-lg transition duration-300"
              onClick={handleOtpSubmit}
            >
              Verify OTP
            </Button>
            <p className="text-center mt-6 text-gray-600">
              Didn't receive the OTP?{" "}
              <Button
                variant="link"
                className="text-[#F04F5F] hover:text-[#E03F4F]"
                onClick={() => setShowOTP(false)}
              >
                Resend OTP
              </Button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
