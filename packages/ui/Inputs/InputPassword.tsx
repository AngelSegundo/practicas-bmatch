import { ChangeEventHandler, ForwardedRef, FunctionComponent } from "react";
import { InputBase, getInputClassName } from "./InputBase";

interface InputTextProps {
  id: string;
  label?: string;
  error?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  containerClassName?: string;
  spanChild?: string;
}

export const InputPassword: FunctionComponent<InputTextProps> = ({
  id,
  label,
  error,
  value,
  placeholder,
  disabled,
  onChange,
  onBlur,
  containerClassName,
  spanChild,
}) => {
  const inputClassName = getInputClassName({ error, label, spanChild });
  return (
    <InputBase
      id={id}
      label={label}
      error={error}
      className={containerClassName}
      spanChild={spanChild}
    >
      <input
        className={inputClassName}
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    </InputBase>
  );
};
