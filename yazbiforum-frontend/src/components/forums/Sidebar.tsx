import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { type ForumTypes, type Tags } from "../../types";
import { getTags } from "../../utils";
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

  const searchTag = (e: ChangeEvent) => {
    const value: string = e.target.value as string;
    if (value == "") return setTagsCache(tags);
    setTagsCache(tags?.filter((tag) => tag.slice(0, value.length) == value.trimEnd()));
    e.preventDefault();
  };

  return (
    <div className="w-full h-full px-5 py-5 border border-[#eee0c7] rounded-xl shadow-md">
      {/* tags */}
      <div className="w-full h-[500px]">
        <div className="w-full flex justify-between">
          <h3 className="mb-3 text-gray-500 select-none">Taglar</h3>
          <div className="underline text-sm text-gray-500 cursor-pointer select-none" onClick={setFilterAll}>
            Hepsi
          </div>
        </div>

        <div className="w-full h-[45px] rounded-full shadow-md border border-[#eee0c7] flex gap-5 px-1">
          <div className="w-[20%] h-full text-right items-center">
            <Icon className="mt-[14px] text-gray-400 text-lg select-none" icon_={faSearch} />
          </div>
          {/* filter search tags */}
          <input
            type="text"
            placeholder="Ara..."
            className="w-[80%] h-full select-none px-2 outline-none text-gray-400"
            onChange={searchTag}
            style={{ background: "none" }}
          />
        </div>

        <div className="w-full h-[300px] flex flex-wrap gap-2 mt-10">
          {tags?.map((tag) => (
            <div>
              {tagsCache?.some((t) => t == tag) ? (
                <button
                  onClick={() => setFilterByTags(tag)}
                  className="min-w-10 h-6 border-2 leading-5 border-dotted border-[#3e87fc] select-none bg-[#c3ddfb]  px-3 rounded-md text-xs text-blue-500 cursor-pointer"
                >
                  {tag}
                </button>
              ) : (
                <button
                  disabled
                  onClick={() => setFilterByTags(tag)}
                  className="min-w-10 h-6 border-2 leading-5 border-dotted border-[#3e87fc] select-none bg-[#c3ddfb]  px-3 rounded-md text-xs text-blue-500 opacity-20"
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
        <h3 className="mb-3 text-gray-500 select-none">Forum Tipleri</h3>
        <div className="w-full flex flex-wrap gap-1">
          <button
            className="w-[80px] h-6 border-2 select-none rounded-md px-3 text-sm border-dotted border-rose-500 bg-rose-300 text-rose-500"
            onClick={() => setFilterByType("soru")}
          >
            Soru
          </button>
          <button
            className="w-[80px] h-6 border-2 select-none rounded-md px-3 text-sm border-dotted border-rose-500 bg-rose-300 text-rose-500"
            onClick={() => setFilterByType("bilgi")}
          >
            Bilgi
          </button>
          <button
            className="w-[80px] h-6 border-2 select-none rounded-md px-3 text-sm border-dotted border-rose-500 bg-rose-300 text-rose-500"
            onClick={() => setFilterByType("tartışma")}
          >
            Tartışma
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
