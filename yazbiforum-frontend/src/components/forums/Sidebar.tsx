import { useState, useEffect } from "react";
import { Colors, type ForumTypes, type Tags } from "../../types";
import { getTags } from "../../utils";
import LoadAnimate from "../LoadAnimate";

type SidebarProps = {
  setFilterByTags: React.Dispatch<React.SetStateAction<Tags | "hepsi">>;
  setFilterByType: React.Dispatch<React.SetStateAction<ForumTypes | "hepsi">>;
};
const Sidebar: React.FC<SidebarProps> = ({ setFilterByTags, setFilterByType }) => {
  const [tags, setTags] = useState<Tags[]>();

  useEffect(() => {
    (async () => setTags((await getTags()).map((x) => x.tag_name)))();
  }, []);

  return (
    <div className="w-[20%] h-[650px]">
      <LoadAnimate atype="left-to-right" duration={400}>
        <div className="w-full h-[650px] bg-[#e7e5de] rounded-md p-3" style={{ color: Colors.Text }}>
          <div
            onClick={() => setFilterByType("hepsi")}
            className="w-20 h-7 text-center text-white text-sm bg-gray-700 leading-7 rounded-sm cursor-pointer hover:bg-gray-800 duration-300"
          >
            Hepsi
          </div>
          <div className="w-full h-16 mt-10">
            <h3 className="w-full mb-2 text-base text-rose-500">Forum Tipleri</h3>

            <div className="w-full h-14 flex gap-3 justify-left">
              <div
                onClick={() => setFilterByType("soru")}
                className="w-20 h-7 text-center text-white text-sm bg-teal-500 leading-7 rounded-sm cursor-pointer hover:bg-teal-600 duration-300"
              >
                Soru
              </div>
              <div
                onClick={() => setFilterByType("bilgi")}
                className="w-20 h-7 text-center text-white text-sm bg-teal-500 leading-7 rounded-sm cursor-pointer hover:bg-teal-600 duration-300"
              >
                Bilgi
              </div>
              <div
                onClick={() => setFilterByType("tartışma")}
                className="w-20 h-7 text-center text-white text-sm bg-teal-500 leading-7 rounded-sm cursor-pointer hover:bg-teal-600 duration-300"
              >
                Tartışma
              </div>
            </div>
          </div>

          <div className="w-full h-full mt-10">
            <h3 className="w-full text-base text-rose-500">Forum Tagları</h3>

            <ul className="w-full h-[450px] flex flex-wrap gap-2 justify-left py-10">
              {tags?.map((tag) => (
                <li
                  onClick={() => setFilterByTags(tag)}
                  className="min-w-[60px] h-8 px-2 bg-gray-300 rounded-sm text-xs text-black text-center cursor-pointer hover:bg-gray-400 duration-300 leading-8"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LoadAnimate>
    </div>
  );
};

export default Sidebar;
