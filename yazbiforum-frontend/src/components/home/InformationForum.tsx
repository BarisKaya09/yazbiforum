import React from "react";
import { Colors } from "../../types";
import LoadAnimate from "../LoadAnimate";
import image3 from "../../assets/image3.svg";

const InformationForumSection: React.FC = () => {
  return (
    <div className="w-full h-[400px]">
      <h1 className="w-full text-5xl text-left" style={{ color: Colors.ColorfullyText }}>
        <LoadAnimate duration={300} atype="left-to-right">
          Bilgi Forumları
        </LoadAnimate>
      </h1>
      <div className="w-full text-lg text-left mt-5 leading-8 flex">
        <div className="w-1/2">
          <LoadAnimate atype="left-to-right">
            Bilgi Forumları, kullanıcıların belirli bir konuda derinlemesine bilgi paylaşımını teşvik eden
            platformlardır. Bu forumlarda, kullanıcılar kendi deneyimlerini paylaşabilir, önerilerde bulunabilir ve
            diğer forum üyeleriyle etkileşimde bulunabilirler. Özellikle belirli bir uzmanlık alanına odaklanmak isteyen
            kullanıcılar, bu tür forumlarda derinlemesine bilgiye ulaşabilir ve uzmanlık alanlarını geliştirebilirler.
          </LoadAnimate>
        </div>
        <div className="w-1/2 relative">
          <LoadAnimate atype="right-to-left">
            <img src={image3} className="w-full h-[700px] absolute -top-80" />
          </LoadAnimate>
        </div>
      </div>
    </div>
  );
};

export default InformationForumSection;
