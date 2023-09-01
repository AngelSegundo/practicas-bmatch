import {
  Fragment,
  useMemo,
  ChangeEventHandler,
  FunctionComponent,
} from "react";
import classNames from "classnames";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

type Option = { value: string; id: string };

interface SelectProps {
  id: string;
  selectOptions: Option[];
  value: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (val: string) => void;
  onBlur?: ChangeEventHandler;
  containerClassName?: string;
  singleValue?: string;
  inputGroup?: boolean;
}

export const Select: FunctionComponent<SelectProps> = ({
  id,
  selectOptions,
  value,
  label = "",
  onChange = () => {
    return;
  },
  error = null,
  disabled = false,
  containerClassName,
  inputGroup = false,
}) => {
  const optionsDict: Record<string, Option> = useMemo(() => {
    return selectOptions.reduce<Record<string, Option>>((dict, option) => {
      dict[option.id] = option;
      return dict;
    }, {});
  }, []);

  const className = classNames({
    "bg-white w-full h-10 min-w-max border border-gray-300 rounded-md shadow-sm pl-3 pr-10 text-left cursor-default focus:outline-none focus:border-gray-300 text-base sm:text-sm":
      !inputGroup,
    "text-right pl-3 pr-10 py-2 text-left text-base sm:text-sm": inputGroup,
    "border-red-300 placeholder-red-500": error,
    "border-gray-300 placeholder-gray-500": !error,
    "opacity-50": disabled,
  });
  const handleOnChange = (option: Option) => {
    onChange(option.id);
  };

  return (
    <div className={containerClassName}>
      <label
        htmlFor={id}
        className="block text-base sm:text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Listbox value={optionsDict[value]} onChange={handleOnChange}>
        {({ open }) => (
          <>
            <div className="relative h-10">
              <Listbox.Button className={className}>
                <span className="flex items-center truncate text-base sm:text-sm">
                  {optionsDict[value] ? optionsDict[value].value : ""}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              {selectOptions.length > 0 && !disabled && (
                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 min-w-max w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-base sm:text-sm">
                    {selectOptions.map((selectOption, i) => (
                      <Listbox.Option
                        key={`${selectOption.id}_${i}`}
                        className={({ active }) =>
                          classNames(
                            active ? "text-black bg-gray-100" : "text-gray-700",
                            "cursor-default select-none relative py-2 pl-3 pr-9"
                          )
                        }
                        value={selectOption}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-normal" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {selectOption.value}
                            </span>
                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-black" : "text-gray-300",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              )}
            </div>
          </>
        )}
      </Listbox>
      <p className="text-base sm:text-sm text-red-500" id="email-error">
        {error}
      </p>
    </div>
  );
};
