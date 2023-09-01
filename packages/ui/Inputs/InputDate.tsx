import classnames from "classnames";
import { ChangeEventHandler, FunctionComponent, forwardRef } from "react";
import { InputBase } from "./InputBase";

interface InputDateProps {
  id: string;
  side?: string;
  label?: string;
  error?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  containerClassname?: string;
  min?: string;
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
  (
    {
      id,
      label,
      error,
      side,
      value,
      disabled,
      onChange,
      onBlur,
      containerClassname,
      min,
    },
    ref
  ) => {
    const inputClassName = classnames(
      "appearance-none form-control block w-full px-3 py-2 border text-gray-900 focus:outline-none focus:z-10 sm:text-sm   bg-clip-padding  transition ease-in-out ",
      {
        "border-red-300 placeholder-red-500": error,
        "border-gray-300 placeholder-gray-500": !error,
        "mt-6": !label,
        "rounded-l-lg": side === "left",
        "rounded-r-lg": side === "right",
        "rounded-md": !side,
      }
    );
    return (
      <InputBase
        id={id}
        label={label}
        error={error}
        className={containerClassname}
      >
        <input
          type="date"
          id={id}
          ref={ref}
          className={inputClassName}
          placeholder="Select a date"
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
        />
      </InputBase>
    );
  }
);
InputDate.displayName = "InputDate";

export default InputDate;
