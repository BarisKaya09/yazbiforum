import React, { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import { faHome, faChartBar, faRightFromBracket, faUserPlus, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";

import AuthService from "../../services/AuthService";
// import Button from "../ui/Button";
import { toast, ToastContainer } from "react-toastify";

const Navbar: React.FC = () => {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);

  useEffect(() => {
    (async () => setIsLoggedin(await AuthService.isLoggedin()))();
  });

  const logout = async () => {
    try {
      const data = await AuthService.logout();
      if (data.success) {
        toast.success(data.data);
        setTimeout(() => (window.location.href = "/"), 1500);
      }
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <div className="w-full h-20 flex p-6">
      <div className="w-3/5 text-base">
        <div className="w-10 h-10 text-2xl font-extrabold cursor-pointer select-none">
          <a href={"/"}>
            <span className="text-[#D63484] border-t-2 border-[#D63484]">Y</span>
            <span className="border-b-2 border-[#D63484]">az</span>
            <span className="text-[#D63484] border-t-2 border-[#D63484]">B</span>
            <span className="border-b-2 border-[#D63484]">i</span>
            <span className="text-[#D63484] border-t-2 border-[#D63484]">F</span>
            <span className="border-b-2 border-[#D63484]">orum</span>
          </a>
        </div>
      </div>
      <div className="w-2/5">
        <ul className="w-full h-full text-[17px] flex gap-4 justify-end pr-10">
          <li className="h-1/2">
            <a href={"/"} className="flex gap-2">
              <Icon icon_={faHome} className="mt-[2px]" />
              <span>Ana Sayfa</span>
            </a>
          </li>
          <li className="h-1/2">
            <a href={"/forums"} className="flex gap-2">
              <Icon icon_={faWpforms} className="mt-[2px]" />
              <span>Forumlar</span>
            </a>
          </li>
          <li className="h-1/2">
            <a href={"/dashboard"} className="flex gap-2">
              <Icon icon_={faChartBar} className="mt-[2px]" />
              <span>Dashboard</span>
            </a>
          </li>
          {!isLoggedin && (
            <li className="h-1/2">
              <a href={"/signin"} className="text-[#D63484] flex gap-2">
                <Icon icon_={faRightFromBracket} className="mt-[2px]" />
                <span>Giriş Yap</span>
              </a>
            </li>
          )}
          {!isLoggedin && (
            <li className="h-1/2">
              <a href={"/signup"} className="text-[#D63484] flex gap-2">
                <Icon icon_={faUserPlus} className="mt-[2px]" />
                <span>Kayıt Ol</span>
              </a>
            </li>
          )}

          {isLoggedin && (
            <li className="h-1/2">
              <button onClick={logout} style={{ backgroundColor: "none", height: "24px" }} className="text-rose-500">
                <div className="flex gap-2">
                  <div>Çıkış Yap</div>
                  <Icon icon_={faCircleDot} className="mt-[2px] pt-[2px]" />
                </div>
              </button>
            </li>
          )}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
