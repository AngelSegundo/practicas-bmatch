import { Fragment, FunctionComponent, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SearchIcon } from "@heroicons/react/outline";
import classnames from "classnames";

export type FiltrableOption = {
  name: string;
  id: string;
};
interface SelectComboProps {
  id: string;
  options: FiltrableOption[];
  selectedOptions: FiltrableOption[];
  disabledOptions?: FiltrableOption[];
  isMultipleSelection: boolean;
  onSelectOption: (selectedOptions: FiltrableOption[]) => void;
  label?: string;
  error?: string;
  disabled?: string;
  placeHolder?: string;
  containerClassName?: string;
  inputGroup?: boolean;
}
const SelectCombo: FunctionComponent<SelectComboProps> = ({
  id,
  options,
  selectedOptions,
  disabledOptions,
  isMultipleSelection,
  label,
  error,
  onSelectOption,
  containerClassName,
  inputGroup,
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((selectOption) =>
          selectOption.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const handleOnSelect = (currentOption: FiltrableOption) => {
    if (
      disabledOptions &&
      disabledOptions.some((option) => option.id === currentOption.id)
    )
      return;
    if (!isMultipleSelection) {
      onSelectOption([currentOption]);
      return;
    }
    const isItemSelected = selectedOptions.some(
      (selectedOption) => selectedOption.id === currentOption.id
    );

    if (isItemSelected) {
      onSelectOption(
        selectedOptions.filter(
          (selectedOption) => selectedOption.id !== currentOption.id
        )
      );
    } else {
      onSelectOption([...selectedOptions, currentOption]);
    }
  };
  const className = classnames({
    "relative w-full cursor-default overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 bg-white border border-gray-300 rounded-md shadow-sm text-left  focus:border-gray-300 sm:text-sm":
      !inputGroup,
    "text-right text-left sm:text-sm": inputGroup,
    "border-red-300 placeholder-red-500": error,
    "border-gray-300 placeholder-gray-500": !error,
  });

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-row justify-between space-x-2">
        <Combobox value={undefined} onChange={handleOnSelect}>
          <div className="relative w-full">
            <Combobox.Button className="w-full border border-none text-left ">
              <div className={className}>
                <Combobox.Input
                  className="w-full border-none h-10 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={() => ""}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SearchIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Combobox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-20 mt-1  border max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ||
                          selectedOptions.some(
                            (selectedOption) => selectedOption.id === option.id
                          )
                            ? selectedOptions.some(
                                (selectedOption) =>
                                  selectedOption.id === option.id
                              )
                              ? disabledOptions?.some(
                                  (selectedOption) =>
                                    selectedOption.id === option.id
                                )
                                ? "text-gray-400 bg-blue-50"
                                : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                              : "bg-blue-600 text-white"
                            : "text-gray-900"
                        }`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option.name}
                          </span>
                          {selectedOptions.some(
                            (selectedOption) => selectedOption.id === option.id
                          ) ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${disabledOptions?.some(
                                (selectedOption) =>
                                  selectedOption.id === option.id
                                    ? "text-gray-400 bg-blue-50"
                                    : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                              )}`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
};

export default SelectCombo;
