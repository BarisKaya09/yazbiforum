import React from "react";
import { Colors } from "../../types";

interface IProps {
  children: any;
  onClick: React.MouseEventHandler;
  height?: string;
  style?: { [key: string]: string };
  disabled?: boolean;
}

const Button: React.FC<IProps> = ({ children, onClick, height, style, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-[150px] h-8 rounded-sm cursor-pointer hover:opacity-90 duration-300"
      style={{
        backgroundColor: Colors.ButtonCardBorder,
        color: Colors.BackgroundColor,
        height: height,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
