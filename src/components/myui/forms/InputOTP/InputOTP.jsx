import React, { useContext } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import "./InputOTP.css";

/**
 * Editorial Apple / Eleven Reader InputOTP Component
 */
export function InputOTP({
  className = "",
  containerClassName = "",
  maxLength = 6,
  value,
  onChange,
  children,
  ...props
}) {
  return (
    <OTPInput
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      containerClassName={`myui-otp-root ${containerClassName}`}
      className={className}
      {...props}
    >
      {children}
    </OTPInput>
  );
}

export function InputOTPGroup({ className = "", children, ...props }) {
  return (
    <div className={`myui-otp-group ${className}`} {...props}>
      {children}
    </div>
  );
}

export function InputOTPSlot({ index, className = "", hasError = false, ...props }) {
  const inputOTPContext = useContext(OTPInputContext);
  const slot = inputOTPContext?.slots?.[index] ?? {};
  const { char, hasFakeCaret, isActive } = slot;

  return (
    <div
      className={`myui-otp-slot ${isActive ? "is-active" : ""} ${
        hasError ? "has-error" : ""
      } ${className}`}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="myui-otp-caret" aria-hidden="true">
          <div className="myui-otp-caret-bar" />
        </div>
      )}
    </div>
  );
}

export default InputOTP;
