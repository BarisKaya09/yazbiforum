import { useEffect, useState } from "react";
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

  return (
    <div className="w-full px-40 pt-20">
      <Routes>
        <Route
          path="/"
          element={
            <div className="w-full h-full flex gap-20">
              <Sidebar setFilterByType={setFilterByType} setFilterByTags={setFilterByTags} filterByTags={filterByTags} filterByType={filterByType} />
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
