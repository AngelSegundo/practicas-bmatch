import { FunctionComponent } from "react";

import Spinner from "./Spinner";
import classnames from "classnames";

interface LoadingSpinnerCardProps {
  translucent?: boolean;
  text: string;
}

const LoadingSpinnerCard: FunctionComponent<LoadingSpinnerCardProps> = ({ translucent, text }) => {
  const commonClassName = "w-full h-screen z-50 flex flex-col items-center justify-center";
  const className = classnames(commonClassName, {
    "bg-white bg-opacity-100": !translucent,
    "bg-gray-100 bg-opacity-80": translucent,
  });

  return (
    <div className={className}>
      <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
        <Spinner />
        <h6 className="text-sm leading-5 font-normal">{text}</h6>
      </div>
    </div>
  );
};

export default LoadingSpinnerCard;
