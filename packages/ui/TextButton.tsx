import { useTranslation } from "next-i18next";
import { FunctionComponent } from "react";
import classnames from "classnames";
import { ArrowNarrowLeftIcon, LogoutIcon } from "@heroicons/react/solid";

export type TextButtonTemplateType =
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | "purchase"
  | "sell"
  | "bmatch-primary";
interface TextButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  template?: TextButtonTemplateType;
  customClassName?: string;
  icon?: string;
}

export const TextButton: FunctionComponent<TextButtonProps> = ({
  label,
  onClick,
  disabled = false,
  template = "default",
  customClassName = "",
  icon = "",
}) => {
  const commonClassName = "text-base font-medium h-6 w-6";
  const { t } = useTranslation("common");

  const className = classnames(commonClassName, customClassName, {
    "text-gray-600": template === "default",
    "text-white bg-teal-600": template === "primary",
    "text-teal-700 bg-teal-100": template === "secondary",
    "text-rose-300": template === "sell",
    "text-green-200": template === "purchase",
    "text-blue-600": template === "bmatch-primary",
    "text-red-600": template === "danger",
    "cursor-pointer": !disabled,
    "hover:text-gray-400": !disabled && template === "default",
    "hover:text-teal-700": !disabled && template === "primary",
    "hover:text-teal-200": !disabled && template === "secondary",
    "hover:text-rose-400": !disabled && template === "sell",
    "hover:text-green-300": !disabled && template === "purchase",
    "hover:text-blue-700": !disabled && template === "bmatch-primary",
    "hover:text-red-700": !disabled && template === "danger",
    "opacity-25": disabled,
  });

  // todo esto no tiene sentido está aqui

  return (
    <button type="button" onClick={onClick} className={customClassName}>
      <div className="flex flex-row items-center py-3 space-x-2">
        {icon === "return" && (
          <ArrowNarrowLeftIcon className={className} aria-hidden="true" />
        )}
        {icon === "exit" && (
          <LogoutIcon className={className} aria-hidden="true" />
        )}
        <p className={className}>{label}</p>
      </div>
    </button>
  );
};
