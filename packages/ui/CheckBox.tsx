import React, { FunctionComponent, ChangeEvent } from "react";
import classnames from "classnames";

interface CheckBoxProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: boolean;
  containerClassName?: string;
  error?: string;
}

export const CheckBox: FunctionComponent<CheckBoxProps> = ({
  id,
  name,
  label,
  required = false,
  onChange,
  value,
  containerClassName,
  error,
}) => {
  const className = classnames("flex items-center pl-1", containerClassName);
  return (
    <div className={className}>
      <input
        id={id}
        name={name}
        type="checkbox"
        className="h-4 w-4 accent-blue-500 focus:ring-blue-700 border-gray-300 rounded"
        checked={value}
        onChange={onChange}
        required={required}
      />
      <label className="ml-2 block text-base sm:text-sm text-gray-700">
        {label}
      </label>
      {error && (
        <p
          className="ml-3 text-base sm:text-sm text-red-500"
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
