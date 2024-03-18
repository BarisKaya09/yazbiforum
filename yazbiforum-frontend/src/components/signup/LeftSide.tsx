import React from "react";
import LoadAnimate from "../LoadAnimate";
import signupImage from "../../assets/signup.svg";

const LeftSide: React.FC = () => {
  return (
    <LoadAnimate atype="left-to-right">
      <img src={signupImage} className="w-full h-full" />
    </LoadAnimate>
  );
};

export default LeftSide;
