import PageTitle from "../../ui/PageTitle";
import EditNameSurname from "./EditNameSurname";
import EditNickname from "./EditNickname";
import EditEmail from "./EditEmail";
import EditPassword from "./EditPassword";
import EditDateOfBirth from "./EditDateOfBirth";
import LoadAnimate from "../../LoadAnimate";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Icon from "../../ui/Icon";
import { UserBody } from "../../../types";
import Button from "../../ui/Button";
import { useEffect, useRef, useState } from "react";
import {
  type EditNameSurnameFields,
  type EditNicknameFields,
  type EditDateOfBirthFields,
  type EditEmailFields,
  type EditPasswordFields,
  type EditField,
  type EditAccountData,
} from "../../../types";
import AccountService from "../../../services/AccountService";
import { ToastContainer, toast } from "react-toastify";

type IProps = {
  account: UserBody | undefined;
};
const Account: React.FC<IProps> = ({ account }) => {
  const [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState<boolean>(false);
  const [editField, setEditField] = useState<EditField | any>();
  const [data, setData] = useState<EditAccountData | any>();

  if (account) {
    return (
      <LoadAnimate atype="top-to-bottom" duration={100}>
        <div className="w-[1000px] m-auto min-h-[300px] p-10 rounded-md text-slate-400">
          <PageTitle>
            <Icon icon_={faGear} className="mr-2" />
            Hesap Ayarları
          </PageTitle>

          <div className="w-full min-h-[200px]">
            <EditNameSurname
              name={account.name}
              surname={account.surname}
              isOpenConfirmPassword={isOpenConfirmPassword}
              setIsOpenConfirmPassword={setIsOpenConfirmPassword}
              editField={editField}
              setEditField={setEditField}
              data={data}
              setData={setData}
            />
            <EditNickname
              nickname={account.nickname}
              isOpenConfirmPassword={isOpenConfirmPassword}
              setIsOpenConfirmPassword={setIsOpenConfirmPassword}
              editField={editField}
              setEditField={setEditField}
              data={data}
              setData={setData}
            />
            <EditDateOfBirth
              dateOfBirth={account.age.toString()}
              isOpenConfirmPassword={isOpenConfirmPassword}
              setIsOpenConfirmPassword={setIsOpenConfirmPassword}
              editField={editField}
              setEditField={setEditField}
              data={data}
              setData={setData}
            />
            <EditEmail
              email={account.email}
              isOpenConfirmPassword={isOpenConfirmPassword}
              setIsOpenConfirmPassword={setIsOpenConfirmPassword}
              editField={editField}
              setEditField={setEditField}
              data={data}
              setData={setData}
            />
            <EditPassword
              isOpenConfirmPassword={isOpenConfirmPassword}
              setIsOpenConfirmPassword={setIsOpenConfirmPassword}
              editField={editField}
              setEditField={setEditField}
              data={data}
              setData={setData}
            />
          </div>
        </div>
      </LoadAnimate>
    );
  }
};

type ConfirmPasswordProps = {
  isOpenConfirmPassword: boolean;
  setIsOpenConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  editField: EditField;
  data: EditAccountData;
};
export const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({
  isOpenConfirmPassword,
  setIsOpenConfirmPassword,
  editField,
  data,
}) => {
  const [cpassword, setCPassword] = useState<string>();
  const ref = useRef<any>();

  useEffect(() => {
    if (isOpenConfirmPassword) ref.current.classList.remove("hidden");
    else ref.current.classList.add("hidden");
  }, [isOpenConfirmPassword]);

  const confirm = async () => {
    if (!cpassword) return;

    //! doğrulama kısmında yanluş şifre girildiğinde, bir sürü toast.error çalışıyor ve çöküyor.
    switch (editField) {
      case "name-surname": {
        const d = data as EditNameSurnameFields;
        const res = await AccountService.updateNameSurname(d.name, d.surname, cpassword);
        if (res.success) {
          toast.success(res.data);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(res.data.error.message);
        }
        break;
      }
      case "nickname": {
        const d = data as EditNicknameFields;
        const res = await AccountService.updateNickname(d.nickname, cpassword);
        if (res.success) {
          toast.success(res.data);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(res.data.error.message);
        }
        break;
      }
      case "date-of-birth": {
        console.log(data);
        const d = data as EditDateOfBirthFields;
        const res = await AccountService.updateDateOfBirth(d.dateOfBirth, cpassword);
        if (res.success) {
          toast.success(res.data);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(res.data.error.message);
        }
        break;
      }
      case "email": {
        const d = data as EditEmailFields;
        const res = await AccountService.updateEmail(d.email, cpassword);
        if (res.success) {
          toast.success(res.data);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(res.data.error.message);
        }
        break;
      }
      case "password": {
        const d = data as EditPasswordFields;
        const res = await AccountService.updatePassword(d.password, cpassword);
        if (res.success) {
          toast.success(res.data);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(res.data.error.message);
        }
        break;
      }
    }
  };

  return (
    <div ref={ref} className="w-full h-full">
      {/* mask */}
      <div
        onClick={() => {
          setIsOpenConfirmPassword(false);
          setCPassword("");
        }}
        className="w-full h-full absolute top-0 left-0 bg-black opacity-50"
      ></div>

      <div className="w-[300px] h-[270px] p-5 absolute top-1/3 left-1/2 bg-[#121526] border border-[#161c32] rounded-lg shadow-2xl select-none">
        <h3 className="w-full h-10 border-b border-slate-600 text-slate-400">Şİfreni Doğrula</h3>
        <div className="w-full text-center mt-10">
          <input
            type="password"
            placeholder="Şifre..."
            className="w-[250px] h-10 border-2 rounded-md pl-3 pr-2 text-sm border-[#1a223b] outline-none focus:border-[#212b4b"
            style={{ background: "none" }}
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
          />
        </div>
        <Button
          onClick={confirm}
          style={{
            width: "70px",
            fontSize: "14px",
            marginTop: "50px",
            marginLeft: "10px",
            backgroundColor: "rgb(15 118 110 / 1)",
          }}
        >
          Doğrula
        </Button>
        <Button
          onClick={() => {
            setIsOpenConfirmPassword(false);
            setCPassword("");
          }}
          style={{ width: "70px", fontSize: "14px", marginTop: "50px", marginLeft: "10px" }}
        >
          İptal Et
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Account;
