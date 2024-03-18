import React, { useEffect, useRef } from "react";
import { type LoadAnimates } from "../types";
import { loadAnimate } from "../utils";

interface IProps {
  children: any;
  atype: LoadAnimates;
  duration?: number;
}

const LoadAnimate: React.FC<IProps> = ({ children, atype, duration }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref != null) {
      loadAnimate(atype, ref.current, duration);
    }
  });
  return (
    <div className="w-full h-full opacity-0" ref={ref}>
      {children}
    </div>
  );
};

export default LoadAnimate;
