import React, { useRef } from "react";
import LoadAnimate from "../LoadAnimate";

import Input from "../ui/Input";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import PageTitle from "../ui/PageTitle";

import validator from "validator";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthService from "../../services/AuthService";

interface RegisterBody {
  name: string;
  surname: string;
  age: string;
  nickname: string;
  email: string;
  password: string;
}

const Form: React.FC = () => {
  const nameRef = useRef<HTMLInputElement | any>();
  const surnameRef = useRef<HTMLInputElement | any>();
  const ageRef = useRef<HTMLInputElement | any>();
  const nicknameRef = useRef<HTMLInputElement | any>();
  const emailRef = useRef<HTMLInputElement | any>();
  const passwordRef = useRef<HTMLInputElement | any>();

  const spinnerIconRef = useRef<any>();

  const sendData = async () => {
    if (
      !nameRef.current.value ||
      !surnameRef.current.value ||
      !ageRef.current.value ||
      !nicknameRef.current.value ||
      !emailRef.current.value ||
      !passwordRef.current.value
    ) {
      toast.error("Lütfen boş alanları doldurun");
      return;
    }

    if (parseInt(ageRef.current.value) < 18) {
      toast.error("En az 18 yaşında olmalısınız");
      return;
    }

    if (!validator.isEmail(emailRef.current.value)) {
      toast.error("Geçersiz email formatı");
      return;
    }

    if ((passwordRef.current.value as string).length <= 7) {
      toast.error("Şifreniz 7 karakterden fazla olmalıdır");
      return;
    }

    const user: RegisterBody = {
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      age: ageRef.current.value,
      nickname: nicknameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    spinnerIconRef.current.classList.remove("hidden");
    try {
      const data = await AuthService.signup(user);
      if (data.success) {
        toast.success(data.data);
      } else {
        toast.error(data.data.error.message);
        spinnerIconRef.current.classList.add("hidden");
      }
    } catch (err: any) {
      throw err;
    }
    spinnerIconRef.current.classList.add("hidden");
  };

  return (
    <LoadAnimate atype="right-to-left">
      <PageTitle textAlign="right" width="45%">
        Kayıt Ol
      </PageTitle>
      <div className="w-full">
        <label htmlFor="name" className="w-full text-base">
          Ad
        </label>{" "}
        <br />
        <Input type="text" ref={nameRef} name="name" />
      </div>

      <div className="w-full mt-5">
        <label htmlFor="surname" className="w-full text-base">
          Soyad
        </label>{" "}
        <br />
        <Input type="text" ref={surnameRef} name="surname" />
      </div>

      <div className="w-full mt-5">
        <label htmlFor="age" className="w-full text-base">
          Yaş
        </label>{" "}
        <br />
        <Input type="date" ref={ageRef} name="age" />
      </div>

      <div className="w-full mt-5">
        <label htmlFor="nickname" className="w-full text-base">
          Kullanıcı Adı
        </label>{" "}
        <br />
        <Input type="text" ref={nicknameRef} name="nickname" />
      </div>

      <div className="w-full mt-5">
        <label htmlFor="email" className="w-full text-base">
          Email Adresi
        </label>{" "}
        <br />
        <Input type="email" ref={emailRef} name="email" />
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
          <Icon icon_={faSpinner} className="animate-spin hidden" ref={spinnerIconRef} /> Kayıt Ol
        </Button>
      </div>
    </LoadAnimate>
  );
};

export default Form;
