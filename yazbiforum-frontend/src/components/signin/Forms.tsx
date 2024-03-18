import { useRef } from "react";
import LoadAnimate from "../LoadAnimate";

import Input from "../ui/Input";
import PageTitle from "../ui/PageTitle";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";

import AuthService from "../../services/AuthService";

interface LoginBody {
  nickname: string;
  password: string;
}

const Form: React.FC = () => {
  const nicknameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const spinnerIconRef = useRef<any>();

  const sendData = async () => {
    if (!nicknameRef.current?.value || !passwordRef.current?.value) {
      toast.error("Lütfen boş alanları doldurunuz");
      return;
    }

    const user: LoginBody = {
      nickname: nicknameRef.current.value,
      password: passwordRef.current.value,
    };

    spinnerIconRef.current.classList.remove("hidden");

    try {
      const data = await AuthService.signin(user);
      if (data.success) {
        toast.success(data.data);
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        toast.error(data.data.error.message);
        spinnerIconRef.current.classList.add("hidden");
        spinnerIconRef.current.classList.add("hidden");
      }
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <LoadAnimate atype="right-to-left">
      <PageTitle textAlign="right" width="45%">
        Giriş Yap
      </PageTitle>

      <div className="w-full">
        <label htmlFor="nickname" className="w-full text-base">
          Kullanıcı Adı
        </label>{" "}
        <br />
        <Input type="text" ref={nicknameRef} name="nikname" />
      </div>

      <div className="w-full mt-5">
        <label htmlFor="password" className="w-full text-base">
          Şifre
        </label>{" "}
        <br />
        <Input type="password" ref={passwordRef} name="password" />
      </div>

      <div className="w-full mt-5">
        <Button onClick={sendData}>
          <Icon icon_={faSpinner} className="animate-spin hidden" ref={spinnerIconRef} /> Giriş Yap
        </Button>
      </div>
    </LoadAnimate>
  );
};

export default Form;
