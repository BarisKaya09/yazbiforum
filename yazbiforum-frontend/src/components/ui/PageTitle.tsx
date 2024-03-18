import { Colors } from "../../types";

interface IProps {
  children: any;
  textAlign?: "left" | "right";
  width?: string;
}

const PageTitle: React.FC<IProps> = ({ children, textAlign = "left", width = "100%" }) => {
  return (
    <h3
      className="w-full text-2xl mb-5"
      style={{ color: Colors.ColorfullyText, textAlign: textAlign, maxWidth: width }}
    >
      {children}
    </h3>
  );
};

export default PageTitle;
