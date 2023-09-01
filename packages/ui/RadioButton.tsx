import { FunctionComponent, ChangeEvent, useState } from "react";
import classnames from "classnames";

interface RadioButtonProps {
  id: string;
  name: string;
  labelTrue: string;
  labelFalse: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  containerClassName?: string;
  defaultValue: string;
}

export const RadioButton: FunctionComponent<RadioButtonProps> = ({
  labelTrue,
  labelFalse,
  name,
  containerClassName,
  onChange,
  defaultValue,
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setSelected(event.target.value);
  };
  const className = classnames(
    "pl-1 form-check-input bg-no-repeat bg-center bg-contain mr-2 cursor-pointer",
    containerClassName
  );
  return (
    <div className="flex justify-start">
      <div>
        <div className="form-check flex items-center">
          <input
            id="radioTrue"
            className={className}
            type="radio"
            value="true"
            name={name}
            onChange={handleChange}
            checked={selected === "true"}
          />
          <label className="form-check-label text-gray-800 text-base sm:text-sm">
            {labelTrue}
          </label>
        </div>
        <div className="form-check flex items-center">
          <input
            id="radioFalse"
            className={className}
            type="radio"
            value="false"
            name={name}
            onChange={handleChange}
            checked={selected === "false"}
          />
          <label className="form-check-label text-gray-800 text-base sm:text-sm">
            {labelFalse}
          </label>
        </div>
      </div>
    </div>
  );
};
