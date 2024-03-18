import { useState, useEffect } from "react";
import { getAccountData } from "../../utils";
import LoginRequired from "../../components/dashboard/LoginRequired";
import Sidebar from "../../components/dashboard/Sidebar";
import { Route, Routes } from "react-router-dom";

import DashboardHome from "../../components/dashboard/Home";
import Account from "../../components/dashboard/account/Account";
import MyForums from "../../components/dashboard/my-forums/MyForums";
import AddForum from "../../components/dashboard/AddForum";
import UpdateForum from "../../components/dashboard/my-forums/UpdateForum";
import Interactions from "../../components/dashboard/interactions/Interactions";

import { type UserBody } from "../../types";
import AuthService from "../../services/AuthService";

const BG = "#121526";
const SIDEBAR_BG = "#161b2e";
// const CARD_BG = "#161c32";

const DashboardPage: React.FC = () => {
  const [account, setAccount] = useState<UserBody>();
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [loadPage, setLoadPage] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      setIsLoggedin(await AuthService.isLoggedin());
      setLoadPage(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isLoggedin) {
        setAccount(await getAccountData());
      }
    })();
  }, [isLoggedin]);

  if (loadPage) {
    if (!isLoggedin) {
      return <LoginRequired />;
    } else {
      return (
        <div className="w-full">
          {account && (
            <div className="w-full min-h-[950px] flex text-white" style={{ backgroundColor: BG }}>
              <div className="w-[15%]">
                <Sidebar bg={SIDEBAR_BG} nickname={account?.nickname} />
              </div>
              <div className="w-full h-full pt-20 pl-32 pr-10">
                <Routes>
                  <Route path="/" element={<DashboardHome nickname={account.nickname} totalForum={account.forums.length} />} />
                  <Route path="myforums" element={<MyForums forums={account.forums} />} />
                  <Route path="interaction" element={<Interactions />} />
                  <Route path="account" element={<Account account={account} />} />
                  <Route path="addforum" element={<AddForum />} />
                  <Route path="updateforum/:id" element={<UpdateForum />} />
                </Routes>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
};

export default DashboardPage;
