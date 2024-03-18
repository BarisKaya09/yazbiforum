import { type ForumBody, type Tags, type ForumTypes } from "../../../types";
import PageTitle from "../../ui/PageTitle";
import { Colors } from "../../../types";
import LoadAnimate from "../../LoadAnimate";
import { NavLink } from "react-router-dom";
import Icon from "../../ui/Icon";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
  IconDefinition,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { getTags, filterForumByTags, filterForumByType, getAccountData } from "../../../utils";
import ForumService from "../../../services/ForumService";
import { ToastContainer, toast } from "react-toastify";
import { ForumSkeletonDark } from "../../ui/ForumSkeleton";

type FilterByTagProps = {
  setFilterTag: React.Dispatch<React.SetStateAction<Tags | "hepsi">>;
};
const FilterByTag: React.FC<FilterByTagProps> = ({ setFilterTag }) => {
  const [tags, setTags] = useState<{ tag_name: string }[]>();
  const [icon, setIcon] = useState<IconDefinition | any>(faChevronDown);
  const tagsRef = useRef<any>();

  useEffect(() => {
    (async () => {
      setTags(await getTags());
    })();
  }, []);

  return (
    <div className="relative w-[70px] h-full rounded-3xl bg-[#161c32] cursor-pointer shadow-2xl select-none">
      <div
        className="w-full h-full pt-3 flex gap-2 pl-4"
        onClick={() => {
          tagsRef.current.classList.toggle("hidden");
          setIcon(icon == faChevronDown ? faChevronUp : faChevronDown);
        }}
      >
        <div>Tag</div>
        <Icon icon_={icon} className="text-xs mt-2" />
      </div>

      <div
        ref={tagsRef}
        className="absolute hidden w-52 h-[300px] z-40 rounded-xl bg-[#161c32] shadow-2xl overflow-scroll -left-16 top-16"
      >
        <ul className="w-full h-full">
          <li
            onClick={() => {
              setFilterTag("hepsi");
              tagsRef.current.classList.add("hidden");
            }}
            className="w-full text-md text-left px-4 py-2 hover:bg-[#111627]"
          >
            Hepsi
          </li>
          {tags?.map((t) => (
            <li
              onClick={() => {
                setFilterTag(t.tag_name as Tags);
                tagsRef.current.classList.add("hidden");
              }}
              className="w-full text-md text-left px-4 py-2 hover:bg-[#111627]"
            >
              {t.tag_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

type FilterByForumTypeProps = {
  setFilterByForumType: React.Dispatch<React.SetStateAction<ForumTypes | "hepsi">>;
};
const FilterByForumType: React.FC<FilterByForumTypeProps> = ({ setFilterByForumType }) => {
  const [icon, setIcon] = useState<IconDefinition | any>(faChevronDown);
  const forumTypesRef = useRef<any>();
  const forumsTypes: ForumTypes[] = ["bilgi", "soru", "tartışma"];

  return (
    <div className="relative w-[120px] h-full rounded-3xl bg-[#161c32] cursor-pointer shadow-2xl select-none">
      <div
        className="w-full h-full pt-3 flex gap-2 pl-4"
        onClick={() => {
          forumTypesRef.current.classList.toggle("hidden");
          setIcon(icon == faChevronDown ? faChevronUp : faChevronDown);
        }}
      >
        <div>Forum Tipi</div>
        <Icon icon_={icon} className="text-xs mt-2" />
      </div>

      <div ref={forumTypesRef} className="absolute hidden w-52 z-40 rounded-xl bg-[#161c32] shadow-2xl -left-16 top-16">
        <ul className="w-full h-full">
          <li
            onClick={() => {
              setFilterByForumType("hepsi");
              forumTypesRef.current.classList.add("hidden");
            }}
            className="w-ful text-md text-left px-4 py-2 hover:bg-[#111627]"
          >
            Hepsi
          </li>
          {forumsTypes.map((t) => (
            <li
              onClick={() => {
                setFilterByForumType(t as ForumTypes);
                forumTypesRef.current.classList.add("hidden");
              }}
              className="w-ful text-md text-left px-4 py-2 hover:bg-[#111627]"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

type SearchForumProps = {
  setUserForums: React.Dispatch<React.SetStateAction<ForumBody[] | any>>;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
};
const SearchForum: React.FC<SearchForumProps> = ({ setUserForums, setSearching }) => {
  const searchUserForums = async (e: any) => {
    setSearching(true);
    if (e.target.value == "") {
      setUserForums((await getAccountData()).forums);
      setTimeout(() => setSearching(false), 200);
      return;
    }

    try {
      const data = await ForumService.searchUserForum(e.target.value);
      if (data.success) setUserForums(data.data);
      setTimeout(() => setSearching(false), 200);
    } catch (err: any) {
      throw err.response.data;
    }
  };

  return (
    <input
      type="text"
      placeholder="Forum ara..."
      className="w-[220px] h-full rounded-3xl bg-[#161c32] shadow-2xl select-none px-4 text-md outline-none"
      onChange={searchUserForums}
    />
  );
};

type IProps = {
  forums: ForumBody[];
};

const MyForums: React.FC<IProps> = ({ forums }) => {
  const [filterTag, setFilterTag] = useState<Tags | "hepsi">("hepsi");
  const [userForums, setUserForums] = useState<ForumBody[]>();
  const [deletedForumId, setDeletedForumId] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);

  useEffect(() => {
    setUserForums(filterForumByTags(forums, filterTag));
  }, [filterTag]);

  const [filterByForumType, setFilterByForumType] = useState<ForumTypes | "hepsi">("hepsi");
  useEffect(() => {
    setUserForums(filterForumByType(forums, filterByForumType));
  }, [filterByForumType]);

  const deleteForum = async (id: string) => {
    try {
      const data = await ForumService.deleteForum(id);
      if (data.success) {
        setDeletedForumId(id);
        toast.success(data.data);
        setTimeout(async () => setUserForums((await getAccountData()).forums), 1000);
      } else {
        toast.error(data.data.error.message);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="w-[1000px] min-h-[600px] px-10 py-3 rounded-md text-slate-400 m-auto">
      <div className="w-full h-[50px] flex justify-between mb-10">
        <div className="mt-4">
          <PageTitle>Forumlarım</PageTitle>
        </div>

        <div className="min-w-[400px] text-right flex gap-3">
          <SearchForum setUserForums={setUserForums} setSearching={setSearching} />
          <FilterByForumType setFilterByForumType={setFilterByForumType} />
          <FilterByTag setFilterTag={setFilterTag} />

          <NavLink to={"../addforum"} className="w-[200px] h-full">
            <div className="w-full h-full bg-[#161c32] rounded-3xl flex gap-3 text-sm pt-[12px] pl-5 shadow-2xl">
              <div className="w-7 h-7 rounded-full bg-gradient-to-t from-[#16cbdc] to-[#616bda] text-center pt-[5px]">
                <Icon icon_={faPlus} className="text-sm" />
              </div>
              <span className="mt-1">Yeni Forum Oluştur</span>
            </div>
          </NavLink>

          <div className="w-[120px] mt-4">Forum Sayısı {forums.length}</div>
        </div>
      </div>

      {forums.length <= 0 ? (
        <div className="">Henüz hiç forumunuz yok!</div>
      ) : (
        <div className="w-full">
          {!userForums?.length ? (
            <div className="text-3xl text-slate-400">Bu filtrelemeye ait hiç forumunuz bulunmamaktadır!</div>
          ) : (
            <div className="w-full">
              {searching ? (
                <ul className="w-full">
                  <li className="w-full">
                    <ForumSkeletonDark />
                  </li>
                </ul>
              ) : (
                <ul className="w-full">
                  {userForums?.map((forum) => (
                    <li className="w-full">
                      <LoadAnimate atype="bottom-to-top" duration={100}>
                        <div
                          style={{ animation: deletedForumId == forum._id ? "deleteAnim 2s" : "" }}
                          className="w-full min-h-[100px] relative py-5 flex gap-3 flex-col pl-5 pr-5 border border-[#161c32] rounded-md mb-5 select-none cursor-pointer hover:opacity-80 duration-300"
                        >
                          <div className="absolute -top-3 -right-5 flex gap-2">
                            <button
                              className="w-6 h-6 bg-rose-500 text-sm text-slate-200"
                              onClick={() => deleteForum(forum._id)}
                            >
                              <Icon icon_={faTrash} />
                            </button>
                            <button className="w-10 h-6 bg-teal-700 text-sm  text-slate-200">
                              <NavLink to={`../updateforum/${forum._id}`}>
                                <Icon icon_={faPenToSquare} />
                              </NavLink>
                            </button>
                          </div>

                          <div className="w-full h-[20%] flex justify-between">
                            <h3 className="text-md" style={{ color: Colors.ColorfullyText }}>
                              {forum.title}
                            </h3>

                            <div className="min-w-[60px] h-[29px] border-2 px-2 border-emerald-600 cursor-pointer rounded-md text-center">
                              {forum.type_}
                            </div>
                          </div>

                          <div className="w-full h-[70%] whitespace-pre-wrap">
                            {forum.content.length < 2000
                              ? forum.content.slice(0, 2000)
                              : forum.content.slice(0, 2000) + " (...)"}
                          </div>

                          <div className="w-full h-[10%] flex justify-between py-1">
                            <div className="w-2/3 h-full flex gap-2">
                              <div className="h-full text-sm text-rose-500 pt-[2px]">{forum.author}</div>
                              {Array.isArray(forum.tag) ? (
                                forum.tag.map((t) => (
                                  <div className="min-w-[60px] h-[22px] px-2 cursor-pointer bg-indigo-700 text-sm text-center rounded-sm leading-5">
                                    {t}
                                  </div>
                                ))
                              ) : (
                                <div className="min-w-[60px] h-[22px] px-2 cursor-pointer bg-indigo-700 text-sm text-center rounded-sm leading-5">
                                  {forum.tag}
                                </div>
                              )}
                              <div className="h-full text-sm pt-[2px]">
                                Son güncelleme {forum.lastUpdate.length == 0 ? "yok" : forum.lastUpdate}
                              </div>
                              <div className="h-full text-sm text-slate-300 pt-[2px]">{forum.likes} Beğeni</div>
                              <div className="h-full text-sm text-slate-300 pt-[2px]">
                                {forum.comments.length} Yorum
                              </div>
                            </div>

                            <div className="w-1/3 text-right pt-[2px]">{forum.releaseDate}</div>
                          </div>
                        </div>
                      </LoadAnimate>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <ToastContainer className="z-50" />
    </div>
  );
};

export default MyForums;
