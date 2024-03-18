import { NavLink } from "react-router-dom";
import Icon from "../ui/Icon";
import { faHome, faHandshake, faGear, faUser, faSquareCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import AuthService from "../../services/AuthService";

interface IProps {
  bg: string;
  nickname: string | undefined;
}

const Sidebar: React.FC<IProps> = ({ bg, nickname }) => {
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
    <div className="w-[15%] h-screen pt-5 fixed top-[80px] left-0" style={{ backgroundColor: bg }}>
      <div className="w-full px-10 mb-10">
        <h3 className="text-lg text-emerald-500">Dashboard</h3>
      </div>

      <div className="w-full h-[70%]">
        <ul className="w-full">
          <li className="w-full text-sm">
            <NavLink
              to={"/dashboard"}
              end
              className={({ isActive }) => {
                return isActive
                  ? "w-full bg-gradient-to-r from-[#462e62] to-[#393162] py-3 px-10 inline-block relative dashboard-active-arrow"
                  : "w-full h-full py-3 px-10 inline-block relative";
              }}
            >
              <Icon icon_={faHome} className="mb-[2px]" /> <span className="ml-1">Ana Sayfa</span>
            </NavLink>
          </li>

          <li className="w-full text-sm">
            <NavLink
              to={"/dashboard/myforums"}
              className={({ isActive }) => {
                return isActive
                  ? "w-full bg-gradient-to-r from-[#462e62] to-[#393162] py-3 px-10 inline-block relative dashboard-active-arrow"
                  : "w-full h-full py-3 px-10 inline-block relative";
              }}
            >
              <Icon icon_={faWpforms} className="mb-[2px]" /> <span className="ml-1">Forumlarım</span>
            </NavLink>
          </li>

          <li className="w-full text-sm">
            <NavLink
              to={"/dashboard/interaction"}
              className={({ isActive }) => {
                return isActive
                  ? "w-full bg-gradient-to-r from-[#462e62] to-[#393162] py-3 px-10 inline-block relative dashboard-active-arrow"
                  : "w-full h-full py-3 px-10 inline-block relative";
              }}
            >
              <Icon icon_={faHandshake} className="mb-[2px]" /> <span className="ml-1">Etkileşimlerim</span>
            </NavLink>
          </li>

          <li className="w-full text-sm">
            <NavLink
              to={"/dashboard/account"}
              className={({ isActive }) => {
                return isActive
                  ? "w-full bg-gradient-to-r from-[#462e62] to-[#393162] py-3 px-10 inline-block relative dashboard-active-arrow"
                  : "w-full h-full py-3 px-10 inline-block relative";
              }}
            >
              <Icon icon_={faGear} className="mb-[2px]" /> <span className="ml-1">Hesap</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="w-full h-[25%]">
        <ul className="w-full">
          <li className="w-full text-sm text-gray-500 py-3 px-10 select-none">
            <NavLink to={"account"}>
              <Icon icon_={faUser} className="text-rose-500 cursor-pointer" />
              <span className="ml-2 cursor-pointer">{nickname}</span>
            </NavLink>
          </li>

          <li className="w-full text-sm text-gray-500 py-3 px-10 select-none">
            <button
              onClick={logout}
              className="w-full py-2 bg-gradient-to-r from-[#d15bef] to-[#a371f8] text-white text-left rounded-md pl-2 pr-2 cursor-pointer flex justify-between hover:bg-gradient-to-l hover:from-[#d15bef] hover:to-[#a371f8]"
            >
              <span>Çıkış Yap</span>
              <Icon icon_={faSquareCaretLeft} className="cursor-pointer mt-[3px] text-base" />
            </button>
          </li>
        </ul>
      </div>

      <ToastContainer className="z-50" />
    </div>
  );
};

export default Sidebar;
