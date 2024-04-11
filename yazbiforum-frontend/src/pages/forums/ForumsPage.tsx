import { useEffect, useState, useRef } from "react";
import { ForumBody, ForumTypes, Tags } from "../../types";
import { filterForumByTags, filterForumByType } from "../../utils";
import { Routes, Route } from "react-router-dom";
import ForumService from "../../services/ForumService";

import Sidebar from "../../components/forums/Sidebar";
import Forums from "../../components/forums/Forums";
import Forum from "../../components/forums/Forum";

const ForumsPages: React.FC = () => {
  const [userForums, setUserForums] = useState<ForumBody[]>();
  const [forums, setForums] = useState<ForumBody[]>();
  useEffect(() => {
    (async () => {
      try {
        const data = await ForumService.getAllForums();
        if (data.success) {
          setForums(data.data);
          setUserForums(data.data);
        }
      } catch (err) {
        throw err;
      }
    })();
  }, []);

  const [filterByType, setFilterByType] = useState<ForumTypes | "hepsi">("hepsi");
  useEffect(() => {
    if (forums) setUserForums(filterForumByType(forums, filterByType));
  }, [filterByType]);

  const [filterByTags, setFilterByTags] = useState<Tags | "hepsi">("hepsi");
  useEffect(() => {
    if (forums) setUserForums(filterForumByTags(forums, filterByTags));
  }, [filterByTags]);

  const sideBarRef = useRef<any>();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY == 0) {
        sideBarRef.current.classList.add("w-full", "h-full");
        sideBarRef.current.classList.remove("fixed", "z-50", "top-[100px]", "w-[15.2%]", "h-[770px]");
      } else {
        sideBarRef.current.classList.remove("w-full", "h-full");
        sideBarRef.current.classList.add("fixed", "z-50", "top-[100px]", "w-[15.2%]", "h-[740px]");
      }
    });
  }, [window.scrollY]);

  return (
    <div className="w-full px-40 pt-20">
      <Routes>
        <Route
          path="/"
          element={
            <div className="w-full h-full flex gap-20">
              <div className="w-[19%] h-[770px]">
                <div ref={sideBarRef} className="w-full h-full">
                  <Sidebar setFilterByType={setFilterByType} setFilterByTags={setFilterByTags} filterByTags={filterByTags} filterByType={filterByType} />
                </div>
              </div>
              <Forums userForums={userForums} setUserForums={setUserForums} />
            </div>
          }
        />
        <Route path=":author/:forum_id" element={<Forum />} />
      </Routes>
    </div>
  );
};

export default ForumsPages;
