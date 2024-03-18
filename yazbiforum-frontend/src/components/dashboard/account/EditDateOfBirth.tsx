import { useRef, useState } from "react";

import Icon from "../../ui/Icon";
import { faBan, faFloppyDisk, faPen } from "@fortawesome/free-solid-svg-icons";
import Button from "../../ui/Button";
import { ConfirmPassword } from "./Account";

import LoadAnimate from "../../LoadAnimate";
import { EditField, EditAccountData } from "../../../types";

type IProps = {
  dateOfBirth: string;
  setIsOpenConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenConfirmPassword: boolean;
  editField: EditField;
  setEditField: React.Dispatch<React.SetStateAction<EditField | undefined>>;
  data: EditAccountData;
  setData: React.Dispatch<React.SetStateAction<EditAccountData | undefined>>;
};
const EditDateOfBirth: React.FC<IProps> = ({
  dateOfBirth,
  setIsOpenConfirmPassword,
  isOpenConfirmPassword,
  editField,
  setEditField,
  data,
  setData,
}) => {
  const editBody = useRef<any>();
  const [editedDateOfBirth, setEditedDateOfBirth] = useState<string>(dateOfBirth);

  return (
    <LoadAnimate atype="top-to-bottom" duration={400}>
      <div className="w-full min-h-[40px]  py-5 pl-5 border border-[#161c32] rounded-md">
        <div className="w-full cursor-pointer">
          <div className="w-full flex justify-between">
            <h3 className="w-11/12 text-slate-400 text-2xl">Doğum Tarihi</h3>
            <Button
              onClick={() => {
                setEditedDateOfBirth(dateOfBirth);
                editBody.current.classList.toggle("hidden");
              }}
              style={{ width: "25px", marginRight: "10px" }}
              height="25px"
            >
              <Icon icon_={faPen} className="w-full" />
            </Button>
          </div>
          <div className="w-full text-sm  text-slate-500 mt-1">{editedDateOfBirth}</div>
        </div>

        <div className="w-full mt-6 mb-5 hidden" ref={editBody}>
          <h3 className="text-lg text-slate-400 mb-5">Doğum Tarihini Düzenle</h3>
          <div className="w-full flex gap-3">
            <input
              type="date"
              value={editedDateOfBirth}
              onInput={(e: any) => setEditedDateOfBirth(e.target.value)}
              className="w-[300px] h-10 border-2 rounded-md pl-3 pr-2 text-sm border-[#1a223b] outline-none focus:border-[#212b4b]"
              style={{ background: "none" }}
            />
          </div>

          <div className="w-full flex gap-3 mt-5 justify-end pr-3">
            <Button
              onClick={() => {
                setIsOpenConfirmPassword(true);
                setEditField("date-of-birth");
                setData({ dateOfBirth: editedDateOfBirth });
              }}
              style={{ width: "30px" }}
            >
              {" "}
              <Icon icon_={faFloppyDisk} />
            </Button>
            <Button
              onClick={() => {
                setEditedDateOfBirth(dateOfBirth);
                editBody.current.classList.add("hidden");
              }}
              style={{ width: "30px" }}
            >
              <Icon icon_={faBan} />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmPassword
        setIsOpenConfirmPassword={setIsOpenConfirmPassword}
        isOpenConfirmPassword={isOpenConfirmPassword}
        editField={editField}
        data={data}
      />
    </LoadAnimate>
  );
};

export default EditDateOfBirth;
