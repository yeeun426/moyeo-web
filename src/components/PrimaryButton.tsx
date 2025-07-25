import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  disabled = false,
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        w-full bg-[#fe8c00] rounded-[15px] py-[15px] mt-[50px] 
        text-center transition-opacity
        ${disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
