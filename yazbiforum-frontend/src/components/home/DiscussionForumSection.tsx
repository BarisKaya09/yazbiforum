import React from "react";
import { Colors } from "../../types";
import LoadAnimate from "../LoadAnimate";
import image4 from "../../assets/image4.svg";

const DiscussionForumSection: React.FC = () => {
  return (
    <div className="w-full h-[400px]">
      <h1 className="w-full text-5xl text-right" style={{ color: Colors.ColorfullyText }}>
        <LoadAnimate duration={300} atype="right-to-left">
          Tartışma Forumları
        </LoadAnimate>
      </h1>
      <div className="w-full text-lg text-right mt-5 leading-8 flex">
        <div className="w-1/2 relative">
          <LoadAnimate atype="left-to-right">
            <img src={image4} className="w-full h-[700px] absolute -top-80 mt-10" />
          </LoadAnimate>
        </div>
        <div className="w-1/2">
          <LoadAnimate atype="right-to-left">
            Tartışma Forumları, farklı görüşleri barındıran ve medeni bir şekilde tartışmalara olanak tanıyan
            platformlardır. Kullanıcılar, çeşitli konular hakkında fikirlerini paylaşabilir, diğer üyelerle etkileşimde
            bulunabilir ve böylece zengin bir düşünce çeşitliliği elde edebilirler. Bu forumlar, kullanıcıların
            eleştirel düşünme becerilerini geliştirmelerine ve topluluk içinde birbirlerini anlamalarına katkı sağlar.
          </LoadAnimate>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForumSection;
