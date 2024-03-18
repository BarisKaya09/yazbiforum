export const ForumSkeletonLight: React.FC = () => {
  return (
    <div className="w-full min-h-[100px] animate-pulse py-5 flex gap-3 flex-col pl-5 pr-5 shadow-md rounded-md mb-5 select-none cursor-pointer hover:opacity-80 duration-300">
      <div className="w-full h-[20%] flex justify-between">
        <h3 className="w-[30%] bg-gray-300 rounded">{/* forum.title */}</h3>

        <div className="min-w-[15%] h-[29px] bg-gray-300">{/* forum.type_ */}</div>
      </div>

      <div className="w-full h-32 rounded bg-gray-300">
        {/* forum.content.length > 2000 ? forum.content.slice(0, 2500) + "(...)" : forum.content.slice(0, 2500) */}
      </div>

      <div className="w-full h-[10%] flex justify-between py-1">
        <div className="w-2/3 h-full flex gap-2">
          <div className="w-20 h-[22px] rounded bg-gray-300">{/* forum.author */}</div>

          <div className="min-w-[60px] rounded h-[22px] cursor-pointer bg-gray-300">{/* forum.tag */}</div>

          <div className="w-40 h-[22px] bg-gray-300 rounded">
            {/* Son güncelleme {forum.lastUpdate.length == 0 ? "yok" : forum.lastUpdate} */}
          </div>
          <div className="w-16 h-[22px] bg-gray-300 rounded">{/* {forum.likes} Beğeni */}</div>
          <div className="w-16 h-[22px] bg-gray-300 rounded">{/* {forum.comments.length} Yorum */}</div>
        </div>

        <div className="w-60 h-[22px] bg-gray-300 rounded">{/* forum.releaseDate */}</div>
      </div>
    </div>
  );
};

export const ForumSkeletonDark: React.FC = () => {
  return (
    <div className="w-full min-h-[100px] animate-pulse relative py-5 flex gap-3 flex-col pl-5 pr-5 border border-[#161c32] rounded-md mb-5">
      <div className="absolute -top-3 -right-5 flex gap-2">
        <button className="w-6 h-6 bg-[#161c32] rounded">{/* <Icon icon_={faTrash} /> */}</button>
        <button className="w-10 h-6 bg-[#161c32] rounded">
          {/* <NavLink to={`../updateforum/${forum._id}`}> */}
          {/* <Icon icon_={faPenToSquare} /> */}
          {/* </NavLink> */}
        </button>
      </div>

      <div className="w-full h-[20%] flex justify-between">
        <h3 className="w-80 h-[29px] rounded bg-[#161c32]">{/* forum.title*/}</h3>

        <div className="w-[60px] h-[29px] bg-[#161c32] rounded">{/* {forum.type_} */}</div>
      </div>

      <div className="w-full h-32 bg-[#161c32] rounded">
        {/* {forum.content.length < 2000 ? forum.content.slice(0, 2000) : forum.content.slice(0, 2000) + " (...)"} */}
      </div>

      <div className="w-full h-[10%] flex justify-between py-1">
        <div className="w-2/3 h-full flex gap-2">
          <div className="w-20 h-[22px] bg-[#161c32] rounded">{/*forum.author*/}</div>

          <div className="min-w-[60px] h-[22px] bg-[#161c32] rounded">{/* {forum.tag} */}</div>

          <div className="w-20 h-[22px] bg-[#161c32] rounded">
            {/* Son güncelleme {forum.lastUpdate.length == 0 ? "yok" : forum.lastUpdate} */}
          </div>
          <div className="w-24 h-[22px] bg-[#161c32] rounded">{/*forum.likes} Beğeni*/}</div>
          <div className="w-24 h-[22px] bg-[#161c32] rounded">{/*forum.comments.length} Yorum*/}</div>
        </div>

        <div className="w-1/3 h-[22px] bg-[#161c32] rounded">{/*forum.releaseDate*/}</div>
      </div>
    </div>
  );
};
