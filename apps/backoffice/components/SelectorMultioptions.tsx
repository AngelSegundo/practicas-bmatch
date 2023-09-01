import { FunctionComponent } from "react";
import SelectCombo, { FiltrableOption } from "ui/SelectCombo";
import TagGroup from "ui/TagGroup";

interface SelectorMultioptionsProps {
  options?: FiltrableOption[];
  daysSelected: FiltrableOption[];
  disabledCommunities?: FiltrableOption[];
  onRemoveClick: (id: string) => void;
  onSelectOption: (selectedOptions: FiltrableOption[]) => void;
  label: string;
  isDense?: boolean;
}
const SelectorMultioptions: FunctionComponent<SelectorMultioptionsProps> = ({
  options = [],
  daysSelected,
  disabledCommunities,
  onSelectOption,
  onRemoveClick,
  label,
  isDense = false,
}) => {
  return (
    <div>
      <SelectCombo
        id="weekDaysSelected"
        options={options}
        selectedOptions={daysSelected}
        onSelectOption={onSelectOption}
        label={label}
        containerClassName="flex flex-col"
        isMultipleSelection={true}
        disabledOptions={disabledCommunities}
      />
      {options.length > 0 && (
        <div className="pt-3 text-sm leading-5 font-normal text-gray-700 space-y-3">
          <TagGroup
            data={daysSelected}
            onClick={onRemoveClick}
            isDense={isDense}
          />
        </div>
      )}
    </div>
  );
};

export default SelectorMultioptions;
