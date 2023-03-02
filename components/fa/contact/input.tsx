import React from "react";

type Props = {
  label: string;
  name: string;
  placeholder: string;
  type: "email" | "text";
};

function Input({ type, label, placeholder, name }: Props) {
  return (
    <div className={`w-full md:w-[48%] last-of-type:w-full`}>
      <label htmlFor={label} className="block text-text">
        {label}
      </label>
      <input
        type={type}
        id={label}
        name={name}
        placeholder={placeholder}
        className="mt-1 py-2 px-3 w-full text-md text-text placeholder:text-darker-text rounded-lg bg-[#3D3D3D40] outline-none"
      />
    </div>
  );
}

export default Input;
