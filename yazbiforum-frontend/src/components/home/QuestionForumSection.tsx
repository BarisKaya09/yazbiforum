import React from "react";
import { Colors } from "../../types";
import LoadAnimate from "../LoadAnimate";
import image2 from "../../assets/image2.svg";

const QuestionForumSection: React.FC = () => {
  return (
    <div className="w-full h-[400px]">
      <h1 className="w-full text-5xl text-right" style={{ color: Colors.ColorfullyText }}>
        <LoadAnimate duration={300} atype="right-to-left">
          Soru Forumları
        </LoadAnimate>
      </h1>
      <div className="w-full text-lg text-right mt-5 leading-8 flex">
        <div className="w-1/2 relative">
          <LoadAnimate atype="left-to-right">
            <img src={image2} className="w-full h-[700px] absolute -top-80" />
          </LoadAnimate>
        </div>
        <div className="w-1/2">
          <LoadAnimate atype="right-to-left">
            Soru Forumları, kullanıcıların belirli konularda sorular sormasına ve diğer üyelerin bu sorulara cevap
            vermesine olanak tanıyan platformlardır. Bu forumlar, merak edilen konularda bilgi arayışında olan
            kullanıcılar için idealdir. Kullanıcılar, burada sorularını paylaşarak geniş bir topluluktan farklı bakış
            açıları ve deneyimlerle zenginleşmiş cevaplar alabilirler.
          </LoadAnimate>
        </div>
      </div>
    </div>
  );
};

export default QuestionForumSection;
