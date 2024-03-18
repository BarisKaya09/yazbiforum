import { ForumBody, ForumTypes, Tags, type LoadAnimates } from "./types";
import axios from "axios";
import { UserBody } from "./types";

export const loadAnimate = (atype: LoadAnimates, element: HTMLElement | null, duration: number = 0) => {
  if (!element) return;

  const observer = new IntersectionObserver((entries, observe) => {
    entries.forEach((entry) => {
      setTimeout(() => {
        if (entry.isIntersecting) {
          entry.target.classList.add(atype);
          entry.target.classList.remove("opacity-0");
          observe.unobserve(entry.target);
        }
      }, duration);
    });
    // observe.disconnect();
  });

  observer.observe(element);
};

export const getAccountData = async (): Promise<UserBody> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/account/getAccountData", { withCredentials: true });
      if (data.success) resolve(data.data as UserBody);
    } catch (err: any) {
      reject(err);
    }
  });
};

export const getTags = async (): Promise<{ tag_name: Tags }[]> => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/forum/getTags");
    // console.log(data);
    if (data.success) {
      return data.data;
    }
  } catch (err: any) {
    console.log(err);
  }
  return Promise.reject("Bir hata oluştu.");
};

export const filterForumByTags = (forums: ForumBody[], filterTag: Tags | "hepsi"): ForumBody[] => {
  return forums.filter((x) =>
    filterTag == "hepsi" ? forums : Array.isArray(x.tag) ? x.tag.includes(filterTag as Tags) : x.tag == filterTag
  );
};

export const filterForumByType = (forums: ForumBody[], filterType: ForumTypes | "hepsi"): ForumBody[] => {
  return forums.filter((forum) => (filterType == "hepsi" ? forum : forum.type_ == filterType));
};
