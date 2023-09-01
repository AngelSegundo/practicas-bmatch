import { FunctionComponent } from "react";
import SelectCombo, { FiltrableOption } from "ui/SelectCombo";
import TagGroup from "ui/TagGroup";

interface SelectorCommunitiesProps {
  options: FiltrableOption[];
  communitiesSelected: FiltrableOption[];
  disabledCommunities?: FiltrableOption[];
  onRemoveClick: (id: string) => void;
  onSelectOption: (selectedOptions: FiltrableOption[]) => void;
}
const SelectorCommunities: FunctionComponent<SelectorCommunitiesProps> = ({
  options,
  communitiesSelected,
  disabledCommunities,
  onSelectOption,
  onRemoveClick,
}) => {
  return (
    <div className="flex flex-col py-4 w-full px-8">
      <div className="flex flex-col py-4 w-full px-8">
        <SelectCombo
          id="communitiesSelected"
          options={options}
          selectedOptions={communitiesSelected}
          onSelectOption={onSelectOption}
          label="Invite users to communities"
          containerClassName="flex flex-col"
          isMultipleSelection={true}
          disabledOptions={disabledCommunities}
        />
      </div>
      {communitiesSelected.length > 0 && (
        <div className="flex flex-row w-full px-8">
          <div className="text-sm leading-5 font-normal text-gray-700 space-y-3">
            <TagGroup data={communitiesSelected} onClick={onRemoveClick} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectorCommunities;
