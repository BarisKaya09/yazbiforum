import LoadAnimate from "../LoadAnimate";
import signinImage from "../../assets/signin.svg";

const LeftSide: React.FC = () => {
  return (
    <LoadAnimate atype="left-to-right">
      <img src={signinImage} className="w-full h-[90%]" />
    </LoadAnimate>
  );
};

export default LeftSide;
