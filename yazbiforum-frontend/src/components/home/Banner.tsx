import React, { useEffect, useState } from "react";
import LoadAnimate from "../LoadAnimate";
import AuthService from "../../services/AuthService";
import Icon from "../ui/Icon";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Banner: React.FC = () => {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  useEffect(() => {
    (async () => setIsLoggedin(await AuthService.isLoggedin()))();
  }, []);

  return (
    <div className="w-full h-[600px] flex gap-10 pt-10">
      <div className="w-1/2">
        <LoadAnimate atype="left-cross-to-bottom">
          <h1 className="text-[90px] font-medium select-none">
            <span className="text-[#D63484]">Y</span>
            <span>az</span>
            <span className="text-[#D63484]">B</span>
            <span>i</span>
            <span className="text-[#D63484]">F</span>
            <span>orum'da</span>
          </h1>
          <h3 className="text-base">
            kendi forumlarını oluştur, başka insanların oluşturduğu forumları oku,{" "}
            <span className="text-[#D63484]">tartışmalara</span> katıl, <span className="text-[#D63484]">bilgi</span> forumlarında
            yeni bilgiler edin yada <span className="text-[#D63484]">soru</span> forumlarında insanlara yardım et.
          </h3>
        </LoadAnimate>
      </div>
      <div className="w-1/2 justify-end flex">
        <LoadAnimate atype="right-cross-to-bottom">
          <div></div>
          <div>
            <h3 className="text-base mt-10 leading-7">
              <span className="border-b-2 border-dashed border-[#D63484]">Bilgi</span> forumları oluşturup forumunuzu okuyacak insanların o konu
              hakkında <span className="border-b-2 border-dashed border-[#D63484]">bilgilenmesini</span> sağla,
              <br />
              <span className="border-b-2 border-dashed border-[#D63484]">Tartışma</span> forumları oluşturup zıt görüşlü insanlarlar{" "}
              <span className="border-b-2 border-dashed border-[#D63484]">tartışıp uzlaş</span>,
              <br />
              <span className="border-b-2 border-dashed border-[#D63484]">Soru</span> forumları oluşturup insanların{" "}
              <span className="border-b-2 border-dashed border-[#d63484]">yardımını al</span>.
            </h3>
            <div className="text-lg mt-5">Bunun için sadece,</div>
            <div className="w-full flex gap-3 mt-5">
              <button
                disabled={isLoggedin ? true : false}
                style={{ opacity: isLoggedin ? "0.4" : "1", cursor: isLoggedin ? "default" : "pointer" }}
                onClick={() => (window.location.href = "/signup")}
                className="w-[120px] h-8 rounded-sm bg-[#D63484] text-[#F8F4EC] cursor-pointer hover:opacity-85 duration-300"
              >
                Kayıt Ol
              </button>
              <div className="text-2xl">&</div>
              <button
                disabled={isLoggedin ? true : false}
                style={{ opacity: isLoggedin ? "0.4" : "1", cursor: isLoggedin ? "default" : "pointer" }}
                onClick={() => (window.location.href = "/signin")}
                className="w-[120px] h-8 rounded-sm bg-[#D63484] text-[#F8F4EC] cursor-pointer hover:opacity-85 duration-300"
              >
                {!isLoggedin ? (
                  <span>Giriş Yap</span>
                ) : (
                  <div>
                    <span>Giriş Yapıldı</span>
                    <Icon icon_={faCircleCheck} className="ml-1 text-emerald-500" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </LoadAnimate>
      </div>
    </div>
  );
};

export default Banner;
