import { FunctionComponent, ReactNode } from "react";
import classnames from "classnames";
import Spinner from "./Spinner";

export type ButtonTemplateType =
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | "purchase"
  | "sell"
  | "bmatch-primary"
  | "bmatch-secondary";

type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
  label: string | (string | JSX.Element | Element);
  onClick: () => void;
  type?: ButtonType;
  disabled?: boolean;
  template?: ButtonTemplateType;
  icon?: ReactNode;
  customClassName?: string;
  spinner?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  template = "default",
  icon: Icon,
  customClassName = "",
  spinner = false,
}) => {
  // Generate className based on common styles and button template or status
  const commonClassName =
    "group relative flex justify-center items-center px-4 h-10 text-base sm:text-sm font-medium rounded-md focus:outline-none";

  const className = classnames(commonClassName, customClassName, {
    "border border-gray-300 text-gray-700 bg-white": template === "default",
    "border border-transparent text-white bg-teal-600": template === "primary",
    "border border-transparent text-teal-700 bg-teal-100":
      template === "secondary",
    "border border-transparent text-rose-700 bg-rose-300": template === "sell",
    "border border-transparent text-green-800 bg-green-200":
      template === "purchase",
    "border border-transparent text-white bg-blue-600":
      template === "bmatch-primary",
    "border border-transparent text-blue-600 bg-blue-50":
      template === "bmatch-secondary",
    "border border-transparent text-white bg-red-600": template === "danger",
    "cursor-pointer": !disabled,
    "hover:bg-gray-100": !disabled && template === "default",
    "hover:bg-teal-700": !disabled && template === "primary",
    "hover:bg-teal-200": !disabled && template === "secondary",
    "hover:bg-rose-400": !disabled && template === "sell",
    "hover:bg-green-300": !disabled && template === "purchase",
    "hover:bg-blue-700": !disabled && template === "bmatch-primary",
    "hover:bg-blue-100": !disabled && template === "bmatch-secondary",
    "hover:bg-danger-700": !disabled && template === "danger",
    "opacity-25 ": disabled,
    "active:opacity-75": !disabled,
  });

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      <>
        {spinner ? (
          <div className="mr-3 gray-500">
            <Spinner width="12" />
          </div>
        ) : (
          Icon
        )}

        {label}
      </>
    </button>
  );
};
