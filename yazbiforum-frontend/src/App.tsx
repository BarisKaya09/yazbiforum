import { useRef, useEffect } from "react";
import Navbar from "./components/app/Navbar";
import { Colors } from "./types";

type IProps = {
  children: any;
};

const App: React.FC<IProps> = ({ children }) => {
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY == 0) {
        navRef.current?.classList.remove(
          "fixed",
          "z-50",
          "border-b",
          `border-[${Colors.ButtonCardBorder}]`,
          `bg-[${Colors.BackgroundColor}]`
        );
      } else {
        navRef.current?.classList.add(
          "fixed",
          "z-50",
          "border-b",
          `border-[${Colors.ButtonCardBorder}]`,
          `bg-[${Colors.BackgroundColor}]`
        );
      }
    });
  }, []);
  return (
    <>
      <div className="w-full bg-[#f8f4ec] duration-300" ref={navRef}>
        <Navbar />
      </div>
      {children}
    </>
  );
};

export default App;
