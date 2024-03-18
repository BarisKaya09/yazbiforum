import React, { useEffect, useState } from "react";
import LeftSide from "../../components/signin/LeftSide";
import Form from "../../components/signin/Forms";
import { ToastContainer } from "react-toastify";
import AuthService from "../../services/AuthService";

const Signin: React.FC = () => {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  useEffect(() => {
    (async () => setIsLoggedin(await AuthService.isLoggedin()))();
  });

  if (!isLoggedin) {
    return (
      <div className="w-full h-full p-24 pt-10">
        <div className="w-full h-[900px] flex m-auto">
          <div className="w-1/2 h-full">
            <LeftSide />
          </div>
          <div className="w-1/2 h-full mt-20">
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

export default Signin;
