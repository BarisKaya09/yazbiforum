import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import LeftSide from "../../components/signup/LeftSide";
import Form from "../../components/signup/Form";
import AuthService from "../../services/AuthService";

const Signup: React.FC = () => {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  useEffect(() => {
    (async () => setIsLoggedin(await AuthService.isLoggedin()))();
  });

  if (!isLoggedin) {
    return (
      <div className="w-full h-full p-24">
        <div className="w-full h-[900px] flex m-auto">
          <div className="w-1/2 h-full">
            <LeftSide />
          </div>
          <div className="w-1/2 h-full pt-10">
            <Form />
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  } else {
    window.location.href = "/";
  }
};

export default Signup;
