import { useState, useEffect, useRef, ChangeEvent } from "react";

import PageTitle from "../ui/PageTitle";
import { ForumTypes, Tags, OPForumBody } from "../../types";
import { getTags } from "../../utils";
import Button from "../ui/Button";
import { toast, ToastContainer } from "react-toastify";
import ForumService from "../../services/ForumService";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Icon from "../ui/Icon";

type TitleInputProps = {
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const TitleInput: React.FC<TitleInputProps> = ({ setTitle }) => {
  return (
    <input
      type="text"
      onChange={(e) => setTitle(e.target.value)}
      className="w-[600px] h-10 border-2 rounded-md pl-3 pr-2 text-sm border-[#1a223b] outline-none focus:border-[#212b4b] whitespace-pre-wrap"
      style={{ background: "none" }}
      placeholder="Başlık"
    />
  );
};

type ContentTextAreaProps = {
  setContent: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const ContentTextArea: React.FC<ContentTextAreaProps> = ({ setContent }) => {
  return (
    <textarea
      onChange={(e) => {
        setContent(e.target.value);
      }}
      className="w-[600px] min-h-[250px] border-2 rounded-md pl-3 pr-2 py-3 text-sm border-[#1a223b] outline-none focus:border-[#212b4b]"
      style={{ background: "none" }}
      placeholder="Form içeriği"
    />
  );
};

type TagProps = {
  tag: Tags;
  setSelectTag: React.Dispatch<React.SetStateAction<Set<Tags> | undefined>>;
  selectedTag: Set<Tags> | undefined;
};
const Tag: React.FC<TagProps> = ({ tag, setSelectTag, selectedTag }) => {
  const tRef = useRef<any>();
  useEffect(() => {
    if (selectedTag?.has(tag)) {
      tRef.current.classList.add("bg-teal-400");
    } else tRef.current.classList.remove("bg-teal-400");
  }, [selectedTag]);

  return (
    <div
      ref={tRef}
      onClick={() => {
        setSelectTag((prevState) =>
          prevState?.has(tag)
            ? new Set([...prevState].filter((x) => x != tag))
            : prevState?.size == 3
              ? new Set([...(prevState || [])])
              : new Set([...(prevState || []), tag])
        );
      }}
      className="min-w-[60px] p-[6px] border-2 border-dotted border-teal-600 bg-teal-200 rounded-lg text-xs text-teal-600 text-center cursor-pointer"
    >
      {tag}
    </div>
  );
};

type ForumTypeProps = {
  setForumType: React.Dispatch<React.SetStateAction<ForumTypes | undefined>>;
  forumType: ForumTypes | undefined;
};
const ForumType: React.FC<ForumTypeProps> = ({ setForumType, forumType }) => {
  const fRef1 = useRef<any>();
  const fRef2 = useRef<any>();
  const fRef3 = useRef<any>();

  useEffect(() => {
    fRef1.current.classList.remove("bg-[#1f2846]");
    fRef2.current.classList.remove("bg-[#1f2846]");
    fRef3.current.classList.remove("bg-[#1f2846]");
    if (forumType == "tartışma") fRef1.current.classList.add("bg-[#1f2846]");
    else if (forumType == "soru") fRef2.current.classList.add("bg-[#1f2846]");
    else if (forumType == "bilgi") fRef3.current.classList.add("bg-[#1f2846]");
  }, [forumType]);

  return (
    <div className="w-full flex gap-3">
      <div
        ref={fRef1}
        onClick={() => {
          setForumType("tartışma");
        }}
        className="py-1 px-10 border-2 border-[#1a223b] cursor-pointer hover:bg-[#1f2846] duration-300 rounded-md"
      >
        Tartışma
      </div>
      <div
        ref={fRef2}
        onClick={() => setForumType("soru")}
        className="py-1 px-10 border-2 border-[#1a223b] cursor-pointer hover:bg-[#1f2846] duration-300 rounded-md"
      >
        Soru
      </div>
      <div
        ref={fRef3}
        onClick={() => setForumType("bilgi")}
        className="py-1 px-10 border-2 border-[#1a223b] cursor-pointer hover:bg-[#1f2846] duration-300 rounded-md"
      >
        Bilgi
      </div>
    </div>
  );
};

const AddForum: React.FC = () => {
  const [tags, setTags] = useState<Tags[]>();
  const [tagsCache, setTagsCache] = useState<Tags[]>();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedTag, setSelectTag] = useState<Set<Tags>>();
  const [forumType, setForumType] = useState<ForumTypes>();

  const spinnerIconRef = useRef<any>();

  useEffect(() => {
    (async () => {
      setTags((await getTags()).map((tag) => tag.tag_name));
      setTagsCache((await getTags()).map((tag) => tag.tag_name));
    })();
  }, []);

  // useEffect(() => {
  //   console.log(title);
  //   console.log(content);
  //   [...(selectedTag || [])].map((x) => console.log(x));
  //   console.log(forumType);
  // }, [title, content, selectedTag, forumType]);

  const addForum = async () => {
    if (!title.trim() || !content.trim() || !selectedTag || selectedTag.size == 0 || !forumType) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }

    const forum: OPForumBody = {
      tag: [...selectedTag],
      title: title.trim(),
      content: content.trim(),
      type_: forumType,
    };

    spinnerIconRef.current.classList.remove("hidden");

    try {
      const data = await ForumService.createForum(forum);
      if (data.success) {
        toast.success(data.data);
      } else {
        toast.error(data.data.error.message);
        throw `[${data.data.error.code}] ` + data.data.error.message;
      }
    } catch (err) {
      throw err;
    }

    spinnerIconRef.current.classList.add("hidden");
  };

  const searchTags = (e: ChangeEvent) => {
    const value: string = e.target.value as string
    if (value == "") return setTagsCache(tags);
    setTagsCache(tags?.filter((tag) => tag.slice(0, value.length) == value.trimEnd()));
    e.preventDefault();
  };

  return (
    <div className="w-[1000px] min-h-[600px] px-10 py-1 rounded-md text-slate-400 m-auto">
      <div className="w-full h-[50px] mb-3">
        <PageTitle>Forum Oluştur</PageTitle>
      </div>

      <div className="w-full mb-4">
        <TitleInput setTitle={setTitle} />
      </div>
      <div className="w-full">
        <ContentTextArea setContent={setContent} />
      </div>
      <div className="w-[68%] min-h-5 mt-4">
        <div className="w-full flex justify-between">
          <h3 className="">Forum Tagınızı seçin</h3>

          <div className="w-[180px] h-7 py-1 px-3 flex gap-2 border border-[#1a223b] rounded-full">
            <Icon icon_={faSearch} className="w-[20%] h-full text-xs" />
            <input type="text" placeholder="Ara.." className="w-[80%] h-full outline-none text-xs" style={{ background: "none" }} onChange={searchTags} />
          </div>
        </div>

        <div className="w-full flex flex-wrap gap-3 mt-4">
          {tags?.map((tag) => (
            <div>
              {tagsCache?.some((t) => t == tag) ? (
                <Tag setSelectTag={setSelectTag} tag={tag} selectedTag={selectedTag} />
              ) : (
                <button disabled className="opacity-20">
                  <Tag setSelectTag={setSelectTag} tag={tag} selectedTag={selectedTag} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[55%] mt-4">
        <h3 className="mb-4">Forum tipini seçin</h3>
        <ForumType setForumType={setForumType} forumType={forumType} />
      </div>

      <Button onClick={addForum} style={{ marginTop: "30px", borderRadius: "6px" }}>
        <Icon icon_={faSpinner} className="mr-2 hidden animate-spin" ref={spinnerIconRef} />
        Oluştur
      </Button>

      <ToastContainer className="z-50" />
    </div>
  );
};

export default AddForum;
