import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import classnames from "classnames";

// todo: definir ui templates si parece necesario
type Template = "info" | "success" | "warning" | "error";
export interface BaseAlert {
  template: Template;
  text: string;
}
interface AlertProps extends BaseAlert {
  onClose: () => void;
}

export const Alert: FunctionComponent<AlertProps> = ({
  template,
  text,
  onClose,
}) => {
  // Select needed icon
  let Icon = null;
  if (template === "info")
    Icon = (
      <InformationCircleIcon
        className="h-5 w-5 text-blue-400"
        aria-hidden="true"
      />
    );
  if (template === "success")
    Icon = (
      <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
    );
  if (template === "warning")
    Icon = (
      <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
    );
  if (template === "error")
    Icon = <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />;

  // Create classnames
  const classNameContainer = classnames(
    "rounded-md p-4 max-w-xs w-fit absolute z-50 bottom-10 left-1/2 transform -translate-x-1/2",
    {
      "bg-blue-50": template === "info",
      "bg-green-50": template === "success",
      "bg-yellow-50": template === "warning",
      "bg-red-50": template === "error",
    }
  );
  const classNameText = classnames("text-sm font-medium", {
    "text-blue-800": template === "info",
    "text-green-800": template === "success",
    "text-yellow-800": template === "warning",
    "text-red-800": template === "error",
  });
  const classNameButton = classnames(
    "inline-flex rounded-md p-1.5 focus:outline-none active:opacity-50",
    {
      "bg-blue-50 text-blue-500 hover:bg-blue-100": template === "info",
      "bg-green-50 text-green-500 hover:bg-green-100": template === "success",
      "bg-yellow-50 text-yellow-500 hover:bg-yellow-100":
        template === "warning",
      "bg-red-50 text-red-500 hover:bg-red-100": template === "error",
    }
  );

  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      closeAlert();
    }, 5000);
    setCurrentTimeout(timeout);

    return () => clearTimeout(timeout);
  }, []);

  const closeAlert = () => {
    onClose();
    if (currentTimeout) clearTimeout(currentTimeout);
  };

  return (
    <>
      <div className={classNameContainer}>
        <div className="flex items-center">
          <div className="flex-shrink-0">{Icon && Icon}</div>
          <div className="ml-3">
            <p className={classNameText}>{text}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={classNameButton}
                onClick={closeAlert}
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
