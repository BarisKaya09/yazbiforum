import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "../ui/Icon";
import { NavLink } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadAnimate from "../LoadAnimate";
import ForumService from "../../services/ForumService";

Chart.register(...registerables);

type LeftTopSideProps = {
  totalForum: number;
  totalLikes: number;
  nickname: string | undefined;
};
const LeftTopSide: React.FC<LeftTopSideProps> = ({ totalForum, totalLikes, nickname }) => {
  return (
    <LoadAnimate atype="top-to-bottom">
      <div className="w-full h-[130px] flex gap-6">
        <div className="w-[270px] h-full rounded-2xl bg-gradient-to-r from-[#d26ef2] to-[#a072f6] text-center pt-4 shadow-2xl select-none cursor-pointer">
          <div>Toplam Beğeni Sayısı</div>
          <div className="w-full text-5xl mt-4">
            <b>{totalLikes}</b>
          </div>
        </div>

        <div className="w-[270px] h-full rounded-2xl bg-gradient-to-r from-[#1fe6e3] to-[#4889d9] text-center pt-4 shadow-2xl select-none cursor-pointer">
          <div>Toplam Forum Sayısı</div>
          <div className="w-full text-5xl mt-4">
            <b>{totalForum}</b>
          </div>
        </div>

        <div className="w-[240px] h-full block relative">
          <NavLink to={"account"} className="w-full h-[45%]">
            <div className="w-full h-[45%] bg-[#161c32] rounded-3xl absolute top-0 flex gap-3 text-sm pt-[16px] pl-5 shadow-2xl select-none cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-t from-[#ed76ac] to-[#ca70e1] text-center pt-[3px]">
                <Icon icon_={faUser} className="text-sm" />
              </div>
              <span className="mt-1">{nickname}</span>
            </div>
          </NavLink>

          <NavLink to={"addforum"} className="w-full h-[45%]">
            <div className="w-full h-[45%] bg-[#161c32] rounded-3xl absolute bottom-0 flex gap-3 text-sm pt-[16px] pl-5 shadow-2xl select-none">
              <div className="w-7 h-7 rounded-full bg-gradient-to-t from-[#16cbdc] to-[#616bda] text-center pt-[5px]">
                <Icon icon_={faPlus} className="text-sm" />
              </div>
              <span className="mt-1">Yeni Forum Oluştur</span>
            </div>
          </NavLink>
        </div>
      </div>
    </LoadAnimate>
  );
};

type TagsT = { tag_name: string }[];
export type ForumCountByTagsT = { tag_name: string; count: number; index: number }[];
type LeftBottomSideProps = {
  tags: TagsT;
  forumCountByTags: ForumCountByTagsT;
};

const LeftBottomSide: React.FC<LeftBottomSideProps> = ({ tags, forumCountByTags }) => {
  const placingCountOfTag = () => {
    if (tags && forumCountByTags) {
      return new Array<number>(29).fill(0).map((x, index) => {
        for (const forumCountByTag of forumCountByTags) {
          if (index == forumCountByTag.index) {
            x = forumCountByTag.count;
          }
        }
        return x;
      });
    }
  };

  const data = {
    labels: tags?.map((x: any) => x.tag_name),
    datasets: [
      {
        label: "Toplam",
        data: placingCountOfTag(),
        fill: false,
        backgroundColor: "#1ac5d9",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Tag'lara göre forum sayısı",
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <LoadAnimate atype="bottom-to-top">
      <div className="w-full min-h-[250px] mt-10 bg-[#161c32] rounded-xl shadow-2xl p-2">
        <Bar data={data} options={options} className="w-full h-full" />
      </div>
    </LoadAnimate>
  );
};

type DashboardHomeProps = {
  nickname: string | undefined;
  totalForum: number;
};
const DashboardHome: React.FC<DashboardHomeProps> = ({ nickname, totalForum }) => {
  const [tags, setTags] = useState<TagsT | any>();
  const [forumCountByTags, setForumCountByTags] = useState<ForumCountByTagsT | any>();
  const [totalLikes, setTotalLikes] = useState<number>(0);

  const getTags = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/forum/getTags", { withCredentials: true });
      if (data.success) {
        setTags(data.data as TagsT);
      }
    } catch (err) {
      throw err;
    }
  };

  const getForumCountByTags = async () => {
    try {
      const data = await ForumService.getForumCountByTags();
      if (data.success) {
        setForumCountByTags(data.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const getTotalLikes = async () => {
    try {
      const data = await ForumService.getTotalLikes();
      if (data.success) {
        setTotalLikes(data.data);
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getTags();
    getForumCountByTags();
    getTotalLikes();
  }, []);

  return (
    <div className="w-full h-full flex">
      <div className="w-[60%] h-full">
        <LeftTopSide totalForum={totalForum} totalLikes={totalLikes} nickname={nickname} />
        <LeftBottomSide tags={tags} forumCountByTags={forumCountByTags} />
      </div>
      <div className="w-1/4 h-full"></div>
    </div>
  );
};

export default DashboardHome;
