import React from "react";
import { Colors } from "../../types";
import LoadAnimate from "../LoadAnimate";
import image1 from "../../assets/image1.svg";

const CreateForumSection: React.FC = () => {
  return (
    <div className="w-full h-[400px]">
      <h1 className="w-full text-5xl text-left" style={{ color: Colors.ColorfullyText }}>
        <LoadAnimate duration={300} atype="left-to-right">
          Forum Oluştur
        </LoadAnimate>
      </h1>
      <div className="w-full text-lg text-left mt-5 leading-8 flex">
        <div className="w-1/2">
          <LoadAnimate atype="left-to-right">
            Forumlar, çevrimiçi ortamlarda kullanıcıların bir araya gelip fikir alışverişinde bulunabileceği, bilgi
            paylaşabileceği ve çeşitli konularda tartışma imkanı bulabileceği interaktif platformlardır. İnternet
            üzerindeki bu topluluklar, kullanıcıların özel ilgi alanlarına yönelik çeşitli forum türleri sunmaktadır.
          </LoadAnimate>
        </div>
        <div className="w-1/2 relative">
          <LoadAnimate atype="right-to-left">
            <img src={image1} className="w-full h-[700px] absolute -top-80" />
          </LoadAnimate>
        </div>
      </div>
    </div>
  );
};

export default CreateForumSection;
