import React from "react";
import Banner from "../../components/home/Banner";
import CreateForumSection from "../../components/home/CreateForumSection";
import QuestionForumSection from "../../components/home/QuestionForumSection";
import InformationForumSection from "../../components/home/InformationForum";
import DiscussionForumSection from "../../components/home/DiscussionForumSection";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full p-24">
      <Banner />
      <CreateForumSection />
      <QuestionForumSection />
      <InformationForumSection />
      <DiscussionForumSection />
    </div>
  );
};

export default HomePage;
