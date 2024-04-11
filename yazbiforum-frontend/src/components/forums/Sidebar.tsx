import { useState, useEffect, useCallback } from "react";
import { Colors, type ForumTypes, type Tags } from "../../types";
import { getTags } from "../../utils";
import LoadAnimate from "../LoadAnimate";
import Icon from "../ui/Icon";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type SidebarProps = {
  filterByTags: Tags | "hepsi";
  setFilterByTags: React.Dispatch<React.SetStateAction<Tags | "hepsi">>;
  filterByType: ForumTypes | "hepsi";
  setFilterByType: React.Dispatch<React.SetStateAction<ForumTypes | "hepsi">>;
};
const Sidebar: React.FC<SidebarProps> = ({ setFilterByTags, setFilterByType, filterByTags, filterByType }) => {
  const [tags, setTags] = useState<Tags[]>();
  const [tagsCache, setTagsCache] = useState<Tags[]>();

  useEffect(() => {
    (async () => {
      setTags((await getTags()).map((x) => x.tag_name));
      setTagsCache((await getTags()).map((x) => x.tag_name));
    })();
  }, []);

  const setFilterAll = useCallback(() => {
    setFilterByTags("hepsi");
    setFilterByType("hepsi");
  }, [filterByTags, filterByType]);

  const searchTag = (e: any) => {
    if (e.target.value == "") return setTagsCache(tags);
    setTagsCache(tags?.filter((tag) => tag.slice(0, e.target.value.length) == e.target.value));
    e.preventDefault();
  };

  return (
    <div className="w-[19%] h-[770px] px-5 py-5 border border-[#eee0c7] rounded-xl shadow-md">
      {/* tags */}
      <div className="w-full h-[500px]">
        <div className="w-full flex justify-between">
          <h3 className="mb-3 text-gray-500">Taglar</h3>
          <div className="underline text-sm text-gray-500 cursor-pointer" onClick={setFilterAll}>
            Hepsi
          </div>
        </div>

        <div className="w-full h-[45px] rounded-full shadow-md border border-[#eee0c7] flex gap-5 px-1">
          <div className="w-[20%] h-full text-right items-center">
            <Icon className="mt-[14px] text-gray-400 text-lg" icon_={faSearch} />
          </div>
          {/* filter search tags */}
          <input type="text" placeholder="Ara..." className="w-[80%] h-full px-2 outline-none text-gray-400" onChange={searchTag} style={{ background: "none" }} />
        </div>

        <div className="w-full h-[300px] flex flex-wrap gap-2 mt-10">
          {tags?.map((tag) => (
            <div>
              {tagsCache?.some((t) => t == tag) ? (
                <button
                  onClick={() => setFilterByTags(tag)}
                  className="min-w-10 h-6 border-2 leading-5 border-dotted border-[#3e87fc] bg-[#c3ddfb]  px-3 rounded-md text-xs text-blue-500 cursor-pointer"
                >
                  {tag}
                </button>
              ) : (
                <button
                  disabled
                  onClick={() => setFilterByTags(tag)}
                  className="min-w-10 h-6 border-2 leading-5 border-dotted border-[#3e87fc] bg-[#c3ddfb]  px-3 rounded-md text-xs text-blue-500 opacity-20"
                >
                  {tag}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* forum tipleri */}
      <div className="w-full h-[50px]">
        <h3 className="mb-3 text-gray-500">Forum Tipleri</h3>
        <div className="w-full flex flex-wrap gap-1">
          <button
            className="w-[80px] h-6 border-2 rounded-md px-3 text-sm border-dotted border-rose-500 bg-rose-300 text-rose-500"
            onClick={() => setFilterByType("soru")}
          >
            Soru
          </button>
          <button
            className="w-[80px] h-6 border-2 rounded-md px-3 text-sm border-dotted border-rose-500 bg-rose-300 text-rose-500"
            onClick={() => setFilterByType("bilgi")}
          >
            Bilgi
          </button>
          <button
            className="w-[80px] h-6 border-2 rounded-md px-3 text-sm border-dotted border-rose-500 bg-rose-300 text-rose-500"
            onClick={() => setFilterByType("tartışma")}
          >
            Tartışma
          </button>
        </div>
      </div>

      {/* <LoadAnimate atype="left-to-right" duration={400}>
        <div className="w-full h-[650px] bg-[#e7e5de] rounded-md p-3" style={{ color: Colors.Text }}>
          <div
            onClick={setFilterAll}
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
      </LoadAnimate> */}
    </div>
  );
};

export default Sidebar;
