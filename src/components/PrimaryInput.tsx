import React from "react";

type PrimaryInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PrimaryInput: React.FC<PrimaryInputProps> = ({
  className = "",
  ...props
}) => {
  return (
    <input
      {...props}
      className={`
        w-full bg-white py-[15px] px-[20px] rounded-[30px] mb-[12px]
        text-sm text-black placeholder:text-[#CACACA] 
        focus:outline-none
        ${className}
      `}
    />
  );
};

export default PrimaryInput;
