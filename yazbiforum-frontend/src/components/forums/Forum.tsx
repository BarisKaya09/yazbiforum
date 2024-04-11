import { useEffect, useState, useRef } from "react";
import { type ForumBody } from "../../types";
import PageTitle from "../ui/PageTitle";
import Icon from "../ui/Icon";
import { faBan, faExclamation, faSpinner, faThumbsUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ForumService from "../../services/ForumService";

const Forum: React.FC = () => {
  const [forumAuthorAndId, setForumAuthorAndId] = useState<string[]>();
  const [forum, setForum] = useState<ForumBody>();
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
  const [forumIsFetchComplated, setForumIsFetchComplated] = useState<boolean>(false);

  useEffect(() => {
    const href = window.location.href.split("/");
    setForumAuthorAndId(href.splice(href.length - 2, href.length - 1));
  }, []);

  const setDatas = async () => {
    try {
      if (!forumAuthorAndId) return;
      const data = await ForumService.getForumById(forumAuthorAndId[0], forumAuthorAndId[1]);
      if (data.success) {
        setForum(data.data.forum);
        if (data.data.forum.likes.users.includes(data.data.nickname)) setAlreadyLiked(true);
        else setAlreadyLiked(false);
      } else {
      }
    } catch (err: any) {
      setForumIsFetchComplated(true);
      throw err;
    }
    setForumIsFetchComplated(true);
  };

  useEffect(() => {
    (async () => {
      await setDatas();
    })();
  }, [forumAuthorAndId]);

  const likeForum = async () => {
    try {
      if (!forum) return;
      const data = await ForumService.likeForum(forum?.author, forum?._id);
      if (data.success) {
        toast.info(data.data);
        await setDatas();
      } else {
        toast.error(data.data.error.message);
      }
    } catch (err: any) {
      throw err;
    }
  };

  // backend cevap döndükten sonra forum bulunmuyorsa veya silinmişse
  if (!forum) {
    return (
      <div className="w-[40%] h-full flex flex-col justify-center py-[200px] m-auto">
        {/**yüklenme animasyonu forum varsada çalışacak */}
        {!forumIsFetchComplated ? (
          <div className="w-20 h-20 text-rose-500 m-auto">
            <Icon icon_={faSpinner} className="w-full h-full animate-spin" />
          </div>
        ) : (
          <div className="w-full h-full">
            <h1 className="text-[55px] text-rose-500">
              <span className="mr-2">Forum bulunamadı</span>
              <Icon icon_={faExclamation} className="p-3 bg-rose-500 text-white rounded-full animate-bounce" />
            </h1>
            <p className="text-sm text-gray-400">
              {forumAuthorAndId?.[0]} adlı kullanıcı {forumAuthorAndId?.[1]} İd'ye sahip forumu kaldırmış.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-fulll px-40">
      <div className="flex gap-2">
        <div className="min-w-[60px] h-[22px] px-2 select-none cursor-pointer text-sm text-center rounded-sm leading-5 text-black bg-gray-300 mt-2">
          {forum?.type_}
        </div>
        <PageTitle>{forum?.title}</PageTitle>
      </div>

      <div className="w-32 h-10 text-sm cursor-pointer">
        <span className="w-10 h-10 p-2 mr-2 rounded-full bg-teal-500 text-xs text-white cursor-pointer select-none">
          <Icon icon_={faUser} />
        </span>
        <span className="select-none">{forum?.author}</span>
      </div>

      <div className="h-10 text-sm flex gap-2 select-none">
        {Array.isArray(forum?.tag) ? (
          forum.tag.map((tag) => (
            <div className="min-w-[60px] px-2 h-[22px] cursor-pointer bg-teal-500 text-sm text-center rounded-sm leading-5 text-white">{tag}</div>
          ))
        ) : (
          <div className="min-w-[60px] px-2 h-[22px] cursor-pointer bg-teal-500 text-sm text-center rounded-sm leading-5 text-white">{forum?.tag}</div>
        )}
      </div>

      <div className="w-full min-h-[50px] text-lg whitespace-pre-wrap py-2 mb-10">{forum?.content}</div>

      <div className="w-full h-20 flex justify-between border-b-2 border-slate-400 rounded-b-2xl">
        <div className="flex gap-3">
          <div className="text-md text-slate-400 select-none">
            <span className="text-slate-600">Oluşturulma Tarihi: </span>
            {forum?.releaseDate}
          </div>

          <div className="text-md text-slate-400 select-none">
            <span className="text-slate-600">Son Güncelleme:</span> {forum?.lastUpdate ? forum.lastUpdate : "Son güncelleme bulunmamakta."}
          </div>
        </div>

        <div className="w-[100px] h-1/3 flex border border-slate-500 rounded-md">
          <div className="w-[60%] h-full text-center leading-6 border-r border-slate-500 text-xs px-1 select-none">{forum?.likes.count} beğeni</div>
          {alreadyLiked ? (
            <button className="w-[40%] h-full text-center hover:bg-slate-500 duration-300">
              <Icon icon_={faBan} />
            </button>
          ) : (
            <button className="w-[40%] h-full text-center hover:bg-slate-500 duration-300" onClick={likeForum}>
              <Icon icon_={faThumbsUp} />
            </button>
          )}
        </div>
      </div>

      <Comments forum={forum} setDatas={setDatas} />
    </div>
  );
};

type CommentsProps = {
  forum: ForumBody | undefined;
  setDatas: () => Promise<void>;
};
const Comments: React.FC<CommentsProps> = ({ forum, setDatas }) => {
  const commentInputRef = useRef<any>();
  const [isFocus, setIsFous] = useState<boolean>(false);

  useEffect(() => {
    const focusEvnt = () => setIsFous(true);
    commentInputRef.current.addEventListener("focus", focusEvnt);

    // cleanup
    return () => {
      removeEventListener("focus", focusEvnt);
    };
  });

  const addComment = async () => {
    if (!forum) return;
    try {
      const data = await ForumService.createComment(forum?.author, forum?._id, commentInputRef.current.value);

      if (data.success) {
        toast.success(data.data);
        await setDatas();
      } else {
        toast.error(data.data.error.message);
      }
    } catch (err: any) {
      throw err;
    }

    setIsFous(false);
    commentInputRef.current.value = "";
  };

  return (
    <div className="w-full py-4 mb-40">
      <h3 className="w-full text-xl font-bold">{forum?.comments.length} Yorum</h3>

      <div
        className="w-full flex justify-between my-6 duration-700"
        style={{ borderBottom: isFocus ? "2px solid rgb(17 24 39 / 1)" : "2px solid rgb(156 163 175 / 1)" }}
      >
        <input type="text" placeholder="Yorum Ekleyin..." className="w-[80%] h-10 outline-none" style={{ background: "none" }} ref={commentInputRef} />

        {isFocus && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsFous(false);
                commentInputRef.current.value = "";
              }}
              className="w-20 h-8 rounded-2xl bg-rose-600 text-slate-200 hover:bg-rose-700 duration-300"
            >
              İptal
            </button>

            <button onClick={addComment} className="w-20 h-8 rounded-2xl bg-teal-600 text-slate-200 hover:bg-teal-700 duration-300">
              Ekle
            </button>
          </div>
        )}
      </div>

      {forum?.comments.reverse().map((f) => (
        <div className="w-full min-h-[100px] p-5 flex flex-col gap-2">
          <div className="w-full text-lg">
            <span className="w-5 h-5 p-1 mr-2 rounded-full bg-teal-500 text-xs text-white cursor-pointer select-none">
              <Icon icon_={faUser} />
            </span>
            @{f.author}
          </div>
          <div className="w-full text-md">{f.content}</div>
          <div className="w-full text-xs text-rose-500">{f.releaseDate}</div>
        </div>
      ))}
    </div>
  );
};

export default Forum;
