import { FunctionComponent, ReactNode } from "react";
import { Message, Validate, ValidationRule } from "react-hook-form";
import classnames from "classnames";

type FieldValues = Record<string, any>;

export type RegisterOptions = Partial<{
  required: Message | ValidationRule<boolean>;
  min: ValidationRule<number | string>;
  max: ValidationRule<number | string>;
  maxLength: ValidationRule<number | string>;
  minLength: ValidationRule<number | string>;
  pattern: ValidationRule<RegExp>;
  // validate:
  //   | Validate<Function, Object>
  //   | Record<string, Validate<Function, Object>>;
}>;

type InputBaseProps = {
  id: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  spanChild?: string;
  children?: ReactNode;
};

export const getInputClassName = ({
  error = "",
  label = "",
  spanChild = "",
  className = "",
}) => {
  // todo: disabled styles
  return classnames(
    "appearance-none rounded-md block w-full px-3 py-2 border text-gray-700 focus:outline-none focus:z-10 text-base sm:text-sm",
    {
      "border-red-300 placeholder-red-500": error,
      "border-gray-300 placeholder-gray-500": !error,
      // "mt-6": !label,
      "pl-7": spanChild,
    },
    className
  );
};

export const InputBase: FunctionComponent<InputBaseProps> = ({
  id,
  label = "",
  error,
  className = "",
  children,
  spanChild,
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-base sm:text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div className="relative rounded-md shadow-sm">
          <>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{spanChild}</span>
            </div>
            {children}
          </>
        </div>
      </div>
      {error && (
        <p
          className="mt-2 text-base sm:text-sm text-red-500"
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
