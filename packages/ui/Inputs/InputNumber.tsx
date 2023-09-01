import React, { ChangeEventHandler, FunctionComponent } from "react";
import { InputBase, getInputClassName } from "./InputBase";

interface InputNumberProps {
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
  min?: number;
  max?: number;
  step?: string;
}

export const InputNumber: FunctionComponent<InputNumberProps> = ({
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
  min,
  max,
  step,
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
        type="number"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        step={step || undefined}
        min={min}
        max={max}
      />
    </InputBase>
  );
};
