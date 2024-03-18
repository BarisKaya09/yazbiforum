import { useRef, useState } from "react";

import Icon from "../../ui/Icon";
import { faBan, faFloppyDisk, faPen } from "@fortawesome/free-solid-svg-icons";
import Button from "../../ui/Button";

import LoadAnimate from "../../LoadAnimate";
import { ConfirmPassword } from "./Account";
import AccountService from "../../../services/AccountService";
import { ToastContainer, toast } from "react-toastify";
import { EditAccountData, EditField } from "../../../types";

type EditPasswordProps = {
  setIsOpenConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenConfirmPassword: boolean;
  editField: EditField;
  setEditField: React.Dispatch<React.SetStateAction<EditField | undefined>>;
  data: EditAccountData;
  setData: React.Dispatch<React.SetStateAction<EditAccountData | undefined>>;
};
const EditPassword: React.FC<EditPasswordProps> = ({
  setIsOpenConfirmPassword,
  isOpenConfirmPassword,
  editField,
  setEditField,
  data,
  setData,
}) => {
  const editBody = useRef<any>();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [passwordIsItCorrect, setPasswordIsItCorrect] = useState<boolean>(false);

  const confirmPasswordEvent = async (e: any) => {
    // doğruğken yanlış girildğinde anında false yapması için bu sayede istek gecikmesi kullanarak tuşa basamayacaklar.
    setPasswordIsItCorrect(false);
    if (e.target.value == "") setPasswordIsItCorrect(false);
    setConfirmPassword(e.target.value);
    const data = await AccountService.passwordIsItCorrect(e.target.value);
    if (data.success) {
      console.log(data.data.passwordIsItCorrect);
      setPasswordIsItCorrect(data.data.passwordIsItCorrect);
    } else {
      throw data.data;
    }
  };

  return (
    <LoadAnimate atype="top-to-bottom" duration={600}>
      <div className="w-full min-h-[40px]  py-5 pl-5 border border-[#161c32] rounded-md">
        <div className="w-full cursor-pointer">
          <div className="w-full flex justify-between">
            <h3 className="w-11/12 text-slate-400 text-2xl">Şifre</h3>
            <Button
              onClick={() => {
                editBody.current.classList.toggle("hidden");
              }}
              style={{ width: "25px", marginRight: "10px" }}
              height="25px"
            >
              <Icon icon_={faPen} className="w-full" />
            </Button>
          </div>
          <div className="w-full text-lg font-bold text-slate-500 mt-1">{...new Array(50).fill(".")}</div>
        </div>

        <div className="w-full mt-6 mb-5 hidden" ref={editBody}>
          <h3 className="text-lg text-slate-400 mb-5">Şifreni Düzenle</h3>
          <div className="w-full flex gap-3">
            <input
              type="password"
              placeholder="Şifreni Doğrula"
              value={confirmPassword}
              onInput={confirmPasswordEvent}
              className="w-[300px] h-10 border-2 rounded-md pl-3 pr-2 text-sm outline-none"
              style={{
                background: "none",
                border: !passwordIsItCorrect ? "2px solid rgb(225 29 72 / 1)" : "2px solid rgb(4 120 87 / 1)",
              }}
            />

            <input
              type="password"
              placeholder="Yeni Şifreni Gir"
              value={newPassword}
              onInput={(e: any) => setNewPassword(e.target.value)}
              className="w-[300px] h-10 border-2 rounded-md pl-3 pr-2 text-sm border-[#1a223b] outline-none focus:border-[#212b4b]"
              style={{ background: "none" }}
            />
          </div>

          <div className="w-full flex gap-3 mt-5 justify-end pr-3">
            <Button
              disabled={!passwordIsItCorrect}
              onClick={() => {
                if (newPassword.length <= 7) {
                  toast.warning("Şifre 7 karakterden büyük olmak zorunda!");
                  return;
                }
                setIsOpenConfirmPassword(true);
                setEditField("password");
                setData({ password: newPassword });
              }}
              style={{ width: "30px", opacity: !passwordIsItCorrect ? "0.2" : "1" }}
            >
              <Icon icon_={faFloppyDisk} />
            </Button>
            <Button
              onClick={() => {
                editBody.current.classList.add("hidden");
              }}
              style={{ width: "30px" }}
            >
              <Icon icon_={faBan} />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmPassword
        setIsOpenConfirmPassword={setIsOpenConfirmPassword}
        isOpenConfirmPassword={isOpenConfirmPassword}
        editField={editField}
        data={data}
      />

      <ToastContainer />
    </LoadAnimate>
  );
};

export default EditPassword;
