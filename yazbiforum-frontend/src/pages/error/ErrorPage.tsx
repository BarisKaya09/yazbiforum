import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const routerError: any = useRouteError();
  return (
    <div className="w-full h-full">
      <div className="w-1/6 m-auto text-center mt-56">
        <h1 className="text-3xl font-bold">
          Ooppps <span className="text-[#D63484]">!!</span>
        </h1>
        <p className="text-xl mt-4">Üzgünüz, beklenmedik bir oluştu.</p>
        <p className="text-md mt-2">{routerError.statusText || routerError.message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
