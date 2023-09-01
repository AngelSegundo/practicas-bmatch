import { FunctionComponent } from "react";
import classnames from "classnames";

export type Template =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "dark"
  | "pink"
  | "indigo"
  | "green50"
  | "purple"
  | "orange";

export interface ChipProps {
  label: string;
  template: Template;
  isSquare?: boolean;
  isColorFill?: boolean;
  isDense?: boolean;
  Icon?: JSX.Element;
  onClick?: () => void;
}
export const Chip: FunctionComponent<ChipProps> = ({
  label,
  template,
  isSquare = false,
  isColorFill = true,
  isDense = true,
  Icon: Icon,
  onClick,
}) => {
  const commonClassName =
    "flex h-fit inline-flex items-center justify-center text-xs leading-4 font-medium";

  let rounded = "rounded-full";
  if (isSquare) rounded = "rounded-md";

  let background = "bg-white";

  if (isColorFill) {
    background = classnames({
      "bg-green-100": template === "success",
      "bg-yellow-200": template === "warning",
      "bg-red-100": template === "error",
      "bg-blue-50 hover:bg-blue-100": template === "info",
      "bg-gray-100": template === "dark",
      "bg-pink-100": template === "pink",
      "bg-indigo-100": template === "indigo",
      "bg-green-200": template === "green50",
      "bg-purple-100": template === "purple",
      "bg-orange-100": template === "orange",
    });
  }
  const className = classnames(commonClassName, rounded, background, {
    "border border-green-100 text-green-700": template === "success",
    "border border-yellow-100 text-yellow-700": template === "warning",
    "border border-red-100 text-red-700": template === "error",
    "border border-blue-50 text-blue-600": template === "info",
    "border border-gray-100 text-gray-800": template === "dark",
    "border border-pink-100 text-pink-800": template === "pink",
    "border border-indigo-100 text-indigo-800": template === "indigo",
    "border border-green-50 text-green-700": template === "green50",
    "border border-green-50 text-purple-700": template === "purple",
    "border border-green-50 text-orange-700": template === "orange",
    "px-2": isDense,
    "py-2 px-3": !isDense,
  });

  return (
    <span className={className} onClick={onClick}>
      {label}
      <button onClick={onClick}>{Icon && Icon}</button>
    </span>
  );
};
