import React, { forwardRef } from "react";
import { Colors } from "../../types";

interface IProps {
  type: string;
  placeholder?: string;
  name: string;
}

const Input = forwardRef(({ type, placeholder, name }: IProps, ref: any) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      ref={ref}
      className="w-[400px] h-10 px-2 rounded-sm bg-slate-300 outline-none focus:border-2 border-indigo-500"
      style={{ color: Colors.Text }}
      name={name}
    />
  );
});

export default Input;
