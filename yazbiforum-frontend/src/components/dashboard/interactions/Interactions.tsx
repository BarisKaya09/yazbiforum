import { useEffect, useState } from "react";
import PageTitle from "../../ui/PageTitle";
import { type LikedForum, type Commented, type Interactions } from "../../../types";
import InteractionsService from "../../../services/InteractionsService";
import { NavLink } from "react-router-dom";
import LoadAnimate from "../../LoadAnimate";
import Icon from "../../ui/Icon";
import { faChevronDown, faChevronUp, faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

const Interactions: React.FC = () => {
  // const [interactions, setInteractions] = useState<Interactions>();
  const [likedForums, setLikedForum] = useState<LikedForum>();
  const [commented, setCommented] = useState<Commented>();

  const getAllInteractions = async () => {
    const data = await InteractionsService.getAllInteractions();
    if (data.success) {
      setLikedForum(data.data.likedForums);
      setCommented(data.data.commented);
    }
  };

  useEffect(() => {
    getAllInteractions();
  }, []);

  if (likedForums && commented) {
    return (
      <div className="w-[1000px] h-full px-10 py-3 rounded-md text-slate-400 m-auto mb-60">
        <PageTitle>Etkileşimlerim</PageTitle>
        <LikedForums likedForums={likedForums} />
        <Commented commented={commented} setCommented={setCommented} />
      </div>
    );
  }
};

export default Interactions;

type LikedForumsProps = {
  likedForums: LikedForum;
};
const LikedForums: React.FC<LikedForumsProps> = ({ likedForums }) => {
  const [close, setClose] = useState<boolean>(true);
  const [lk, setLk] = useState<LikedForum>(close ? likedForums.slice(0, 2) : likedForums);

  useEffect(() => {
    setLk(close ? likedForums.slice(0, 2) : likedForums);
  }, [close]);

  if (likedForums) {
    return (
      <div className="w-full mt-10 mb-5">
        <h3 className="w-full text-lg text-slate-400 border-b border-slate-400">Beğenilen forumlar</h3>

        {!lk.length ? (
          <div className="w-full h-full mt-5">Henüz hiç yorum beğenmediniz!</div>
        ) : (
          <div className="w-full h-full">
            <div className="w-[100px] h-[10px] cursor-pointer" onClick={() => setClose(!close)}>
              <Icon icon_={close ? faChevronUp : faChevronDown} />
            </div>

            <div className="w-full">
              <ul className="w-full mt-5">
                {lk.map((likedForum) => (
                  <LoadAnimate atype="bottom-to-top">
                    <NavLink to={`../../forums/${likedForum.author}/${likedForum._id}`}>
                      <li className="w-full">
                        <div className="w-full mi-h-[100px] relative py-5 flex gap-3 flex-col pl-5 pr-5 border border-[#161c32] rounded-md mb-5 select-none cursor-pointer hover:opacity-80 duration-300">
                          <div className="w-full flex justify-between">
                            <div>{likedForum.author}</div>
                            <div>{likedForum.releaseDate}</div>
                          </div>

                          <div className="w-full text-sm">{likedForum.title}</div>
                        </div>
                      </li>
                    </NavLink>
                  </LoadAnimate>
                ))}
                {close && (
                  <li className="w-full">
                    <Icon icon_={faEllipsis} className="text-2xl" />
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <ToastContainer className="z-50" />
      </div>
    );
  }
};

type CommentedProps = {
  commented: Commented;
  setCommented: React.Dispatch<React.SetStateAction<Commented | undefined>>;
};
const Commented: React.FC<CommentedProps> = ({ commented, setCommented }) => {
  const [close, setClose] = useState<boolean>(true);
  const [c, setC] = useState<Commented>(close ? commented.slice(0, 2) : commented);
  const [deletedCommentId, setDeletedCommentId] = useState<string>("");

  const formatC = () => {
    setC(close ? commented.slice(0, 2) : commented);
  };

  useEffect(() => {
    formatC();
  }, [close, commented]);

  const deleteComment = async (forumId: string, author: string, commentId: string) => {
    const data = await InteractionsService.deleteComment(forumId, author, commentId);
    if (data.success) {
      setDeletedCommentId(commentId);
      toast.success(data.data);
      const interactions = await InteractionsService.getAllInteractions();
      if (interactions.success) {
        setTimeout(() => setCommented(interactions.data.commented), 1000);
      }
    } else {
      toast.error(data.data.error.message);
    }
  };

  return (
    <div className="w-full mt-10">
      <h3 className="w-full text-lg text-slate-400 border-b border-slate-400">Yapılan Yorumlar</h3>

      {!c.length ? (
        <div className="w-full h-full mt-5">Henüz hiç yorum yapmadınız!</div>
      ) : (
        <div className="w-full h-full">
          <div className="w-[100px] h-[10px] cursor-pointer" onClick={() => setClose(!close)}>
            <Icon icon_={close ? faChevronUp : faChevronDown} />
          </div>

          <div className="w-full">
            <ul className="w-full mt-5">
              {c.map((c) => (
                <LoadAnimate atype="bottom-to-top">
                  <li className="w-full relative">
                    <NavLink to={`../../forums/${c.author}/${c._id}`}>
                      <div
                        style={{ animation: deletedCommentId == c.comment._id ? "deleteCommentAnim 1.5s ease-in-out" : "" }}
                        className="w-full mi-h-[100px] py-5 flex gap-3 flex-col pl-5 pr-5 border-4 border-[#161c32] rounded-md mb-5 select-none cursor-pointer hover:opacity-80 duration-300"
                      >
                        <div className="w-full flex justify-between">
                          <div>{c.author}</div>
                          <div>{c.releaseDate}</div>
                        </div>

                        <div className="w-full text-sm">{c.title}</div>
                      </div>
                    </NavLink>

                    <LoadAnimate atype="right-to-left">
                      <div
                        style={{ animation: deletedCommentId == c.comment._id ? "deleteCommentAnim 1.5s ease-in-out" : "" }}
                        className="w-[80%] relative ml-20 mt-10 py-5 pl-5 pr-5 border-x-4 border-[#161c32] rounded-md mb-5 select-none cursor-pointer hover:opacity-80 duration-300"
                      >
                        <div id="coll"></div>
                        <div id="row"></div>
                        <div>{c.comment.content}</div>
                        <div>{c.comment.releaseDate}</div>

                        <div className="absolute top-[-10px] left-[-10px]">
                          <button
                            className="w-6 h-6 bg-rose-500 text-xs text-slate-200 hover:scale-125 hover:text-sm  duration-300 rounded-md"
                            onClick={() => deleteComment(c._id, c.author, c.comment._id)}
                          >
                            <Icon icon_={faTrash} className="mt-1" />
                          </button>
                        </div>
                      </div>
                    </LoadAnimate>
                  </li>
                </LoadAnimate>
              ))}

              {close && (
                <li className="w-full">
                  <Icon icon_={faEllipsis} className="text-2xl" />
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
