import { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Icon from "../ui/Icon";
import LoadAnimate from "../LoadAnimate";
import { Colors, type ForumBody } from "../../types";
import { NavLink } from "react-router-dom";
import { ForumSkeletonLight } from "../ui/ForumSkeleton";
import ForumService from "../../services/ForumService";

type NavProps = {
  setUserForums: React.Dispatch<React.SetStateAction<ForumBody[] | any>>;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
};
const Nav: React.FC<NavProps> = ({ setUserForums, setSearching }) => {
  const searchForum = async (e: any) => {
    setSearching(true);
    // eğer e.target.value boş ise tüm forumları getir
    if (e.target.value == "") {
      try {
        const data = await ForumService.getAllForums();
        if (data.success) setUserForums(data.data);
        setTimeout(() => setSearching(false), 200);
      } catch (err) {
        throw err;
      }
      return;
    }

    try {
      const data = await ForumService.searchForum(e.target.value);
      if (data.success) {
        setUserForums(data.data);
      }
      setTimeout(() => setSearching(false), 200);
    } catch (err) {
      throw err;
    }
  };

  return (
    <LoadAnimate atype="right-to-left" duration={400}>
      <div className="w-full flex justify-end">
        <div className="w-[400px] h-9 flex bg-gray-600 p-2 rounded-sm">
          <input
            type="text"
            placeholder="Ara"
            className="w-[370px] h-full text-white text-sm outline-none pl-2"
            style={{ background: "none" }}
            onChange={searchForum}
          />
          <Icon icon_={faSearch} className="w-[30px] h-full text-white cursor-pointer" />
        </div>
      </div>
    </LoadAnimate>
  );
};

type ForumsBodyProps = {
  userForums: ForumBody[];
  searching: boolean;
};
const ForumsBody: React.FC<ForumsBodyProps> = ({ userForums, searching }) => {
  return (
    <div className="w-full min-h-[700px] mt-10">
      {searching ? (
        <ul className="w-full">
          <li className="w-full">
            <ForumSkeletonLight />
            <ForumSkeletonLight />
            <ForumSkeletonLight />
          </li>
        </ul>
      ) : (
        <ul className="w-full">
          {userForums?.map((forum) => (
            <li className="w-full">
              <LoadAnimate atype="bottom-to-top" duration={100}>
                <NavLink to={`${forum.author}/${forum._id}`}>
                  <div className="w-full min-h-[100px] py-5 flex gap-3 flex-col pl-5 pr-5 border-x shadow-md border-slate-600 rounded-md mb-5 select-none cursor-pointer hover:opacity-80 duration-300">
                    <div className="w-full h-[20%] flex justify-between">
                      <h3 className="text-md" style={{ color: Colors.ColorfullyText }}>
                        {forum.title}
                      </h3>

                      <div className="min-w-[60px] h-[29px] border-2 border-emerald-600 cursor-pointer rounded-md text-center px-2">
                        {forum.type_}
                      </div>
                    </div>

                    <div className="w-full h-[70%]">
                      {forum.content.length > 2000 ? forum.content.slice(0, 2500) + "(...)" : forum.content.slice(0, 2500)}
                    </div>

                    <div className="w-full h-[10%] flex justify-between py-1">
                      <div className="w-2/3 h-full flex gap-2">
                        <div className="h-full text-sm text-rose-500 pt-[2px]">{forum.author}</div>
                        {Array.isArray(forum.tag) ? (
                          forum.tag.map((t) => (
                            <div className="min-w-[60px] px-2 h-[22px] cursor-pointer bg-teal-500 text-sm text-center rounded-sm leading-5 text-white">
                              {t}
                            </div>
                          ))
                        ) : (
                          <div className="min-w-[60px] px-2 h-[22px] cursor-pointer bg-teal-500 text-sm text-center rounded-sm leading-5 text-white">
                            {forum.tag}
                          </div>
                        )}
                        <div className="h-full text-sm pt-[2px]">
                          Son güncelleme {forum.lastUpdate.length == 0 ? "yok" : forum.lastUpdate}
                        </div>
                        <div className="h-full text-sm text-teal-500 pt-[2px]">{forum.likes.count} Beğeni</div>
                        <div className="h-full text-sm text-teal-500 pt-[2px]">{forum.comments.length} Yorum</div>
                      </div>

                      <div className="w-1/3 text-right pt-[2px]">{forum.releaseDate}</div>
                    </div>
                  </div>
                </NavLink>
              </LoadAnimate>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type ForumsProps = {
  userForums: ForumBody[] | any;
  setUserForums: React.Dispatch<React.SetStateAction<ForumBody[] | any>>;
};
const Forums: React.FC<ForumsProps> = ({ userForums, setUserForums }) => {
  const [searching, setSearching] = useState<boolean>(false);

  return (
    <div className="w-[80%] h-full">
      <Nav setUserForums={setUserForums} setSearching={setSearching} />
      <ForumsBody userForums={userForums} searching={searching} />
    </div>
  );
};

export default Forums;
