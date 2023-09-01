import React, { ChangeEventHandler, FunctionComponent } from "react";
import { InputBase, getInputClassName } from "./InputBase";

interface InputTextProps {
  id: string;
  label?: string;
  error?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler;
  containerClassName?: string;
  inputClassName?: string;
  spanChild?: string;
}

export const InputText: FunctionComponent<InputTextProps> = ({
  id,
  label,
  error,
  value,
  placeholder,
  disabled,
  onChange,
  onBlur,
  containerClassName,
  inputClassName,
  spanChild,
}) => {
  const calculatedInputClassnames = getInputClassName({
    error,
    label,
    spanChild,
    className: inputClassName,
  });
  return (
    <InputBase
      id={id}
      label={label}
      error={error}
      className={containerClassName}
      spanChild={spanChild}
    >
      <input
        className={calculatedInputClassnames}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    </InputBase>
  );
};
