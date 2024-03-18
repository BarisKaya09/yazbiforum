import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IProps {
  icon_: IconDefinition;
  className?: string;
}

const Icon = forwardRef(({ icon_, className }: IProps, ref: any) => {
  return <FontAwesomeIcon icon={icon_} className={className} ref={ref} />;
});

export default Icon;
