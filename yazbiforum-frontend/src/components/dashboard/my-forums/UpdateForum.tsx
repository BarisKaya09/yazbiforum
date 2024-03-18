import { useState, useEffect, useRef } from "react";
import ForumService from "../../../services/ForumService";
import { ForumTypes, Tags, type UpdateForumBody } from "../../../types";
import Icon from "../../ui/Icon";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getTags } from "../../../utils";
import Button from "../../ui/Button";
import { ToastContainer, toast } from "react-toastify";

type TitleProps = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const Title: React.FC<TitleProps> = ({ title, setTitle }) => {
  return (
    <input
      className="w-[600px] h-10 border-2 rounded-md pl-3 pr-2 text-sm border-[#1a223b] outline-none focus:border-[#212b4b] whitespace-pre-wrap"
      style={{ background: "none" }}
      value={title}
      placeholder="Forum başlığı..."
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};

type ContentProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const Content: React.FC<ContentProps> = ({ content, setContent }) => {
  return (
    <textarea
      className="w-[600px] min-h-[350px] border-2 rounded-md pl-3 pr-2 py-3 text-sm border-[#1a223b] outline-none focus:border-[#212b4b]"
      style={{ background: "none" }}
      placeholder="Forum içeriği..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};

type TagProps = {
  userTags: Tags[];
  setUserTags: React.Dispatch<React.SetStateAction<Tags[] | undefined>>;
};
const Tag: React.FC<TagProps> = ({ userTags, setUserTags }) => {
  const [tags, setTags] = useState<Tags[]>();
  const tagRef = useRef<any>();

  const getAllTags = async (): Promise<Tags[]> => {
    return (await getTags()).map((x) => x.tag_name).filter((x) => !userTags.includes(x));
  };

  useEffect(() => {
    (async () => {
      setTags(await getAllTags());
    })();
  }, []);

  return (
    <div className="w-full flex flex-wrap gap-2">
      {userTags.map((t) => (
        <div
          onClick={() => setUserTags(userTags.filter((x) => x != t))}
          className="min-w-[60px] h-10 px-2 leading-10 bg-slate-400 rounded-md text-xs text-black text-center cursor-pointer hover:bg-slate-500 duration-300"
        >
          {t}
        </div>
      ))}

      <div className="w-[200px] relative">
        <div
          onClick={() => userTags.length < 3 && tagRef.current.classList.toggle("hidden")}
          className="w-10 h-10 p-2 border border-[#1a223b] rounded-md text-center leading-7 cursor-pointer hover:bg-[#1a223b] ml-4"
        >
          <Icon icon_={faPlus} className="w-5 h-5" />
        </div>

        <div
          ref={tagRef}
          className="absolute hidden w-52 h-[300px] z-40 rounded-xl bg-[#161c32] shadow-2xl overflow-scroll top-12 -left-16"
        >
          <ul className="w-full h-full">
            <li className="w-full m-auto text-md text-left py-2 hover:bg-[#111627] cursor-pointer border border-[#1a223b]">
              <input
                type="text"
                placeholder="Tag ara..."
                className="w-full px-2 outline-none"
                style={{ background: "none" }}
                onChange={async (e) => {
                  const tags_ = await getAllTags();
                  setTags(
                    e.target.value != ""
                      ? tags_?.filter((tag) => tag.slice(0, e.target.value.length).includes(e.target.value))
                      : tags_
                  );
                }}
              />
            </li>
            {tags?.map((tag) => (
              <li
                onClick={() => {
                  setUserTags((prev) => prev && [...prev, tag]);
                  if (userTags.length >= 2) tagRef.current.classList.add("hidden");
                }}
                className=" w-full text-md text-left px-4 py-2 hover:bg-[#111627] cursor-pointer"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

type ForumTypeProps = {
  forumType: ForumTypes;
  setForumType: React.Dispatch<React.SetStateAction<ForumTypes | undefined>>;
};
const ForumType: React.FC<ForumTypeProps> = ({ forumType, setForumType }) => {
  return (
    <select
      className="w-[200px] h-10 bg-[#121526] px-2 cursor-pointer rounded-md border-2 border-[#1a223b]"
      value={forumType}
      onChange={(e: any) => setForumType(e.target.value)}
    >
      <option value="tartışma" className="bg-transparent hover:bg-transparent">
        Tartışma
      </option>
      <option value="bilgi" className="bg-transparent hover:bg-transparent">
        Bilgi
      </option>
      <option value="soru" className="bg-transparent hover:bg-transparent">
        Soru
      </option>
    </select>
  );
};

const UpdateForum: React.FC = () => {
  const [title, setTitle] = useState<string | any>();
  const [content, setContent] = useState<string | any>();
  const [userTags, setUserTags] = useState<Tags[] | any>();
  const [forumType, setForumType] = useState<ForumTypes | any>();

  const [cancel, setCancel] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const hrefs = window.location.href.split("/");
  const id = hrefs[hrefs.length - 1];

  useEffect(() => {
    (async () => {
      try {
        const data = await ForumService.getUserForumById(id);
        if (data.success) {
          setTitle(data.data.title);
          setContent(data.data.content);
          setUserTags(Array.isArray(data.data.tag) ? data.data.tag : [data.data.tag]);
          setForumType(data.data.type_);

          setCancel(false);
        }
      } catch (err) {
        throw err;
      }
    })();
  }, [cancel]);

  const saveUpdates = async () => {
    setIsUpdate(true);
    try {
      console.log(forumType);
      const updateData: Partial<UpdateForumBody> = {
        tag: userTags,
        title,
        content,
        type_: forumType,
      };
      const data = await ForumService.updateForum(id, updateData);
      if (data.success) {
        toast.success(data.data);
      } else {
        toast.error(data.data.error.message);
      }
    } catch (err: any) {
      throw err;
    }
    setIsUpdate(false);
  };

  if (title != undefined && content != undefined && userTags != undefined && forumType != undefined) {
    return (
      <div className="w-[1000px] min-h-[600px] px-10 py-3 rounded-md text-slate-400 m-auto">
        <div className="w-full mb-4">
          <Title title={title} setTitle={setTitle} />
        </div>
        <div className="w-full mb-4">
          <Content content={content} setContent={setContent} />
        </div>
        <div className="w-full mb-4 select-none">
          <h3 className="mb-4">Forum Tagınızı seçin</h3>
          <Tag userTags={userTags} setUserTags={setUserTags} />
        </div>
        <div className="w-full mb-4 select-none">
          <h3 className="mb-4">Forum Tipini seçin</h3>
          <ForumType forumType={forumType} setForumType={setForumType} />
        </div>

        <div className="w-full flex gap-2">
          <Button onClick={saveUpdates} style={{ width: "200px", backgroundColor: "rgb(15 118 110 / 1)" }}>
            {isUpdate && <Icon icon_={faSpinner} className="animate-spin mr-2" />}
            Değişiklikeri kaydet
          </Button>
          <Button onClick={() => setCancel(true)} style={{ width: "100px" }}>
            {cancel && <Icon icon_={faSpinner} className="animate-spin mr-2" />}
            İptal Et
          </Button>
        </div>

        <ToastContainer className="z-50" />
      </div>
    );
  }
};

// type_: ForumTypes;

export default UpdateForum;
