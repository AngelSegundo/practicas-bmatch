import { XIcon } from "@heroicons/react/outline";
import React, { FunctionComponent } from "react";
import { Chip, FiltrableOption } from "ui";
interface TagGroupProps {
  data: FiltrableOption[];
  onClick: (id: string) => void;
  isDense?: boolean;
}

const TagGroup: FunctionComponent<TagGroupProps> = ({
  data,
  onClick,
  isDense = false,
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {data.map((element) => (
        <div key={element.id}>
          <Chip
            isDense={isDense}
            label={element.name}
            template={"info"}
            isSquare={true}
            Icon={
              <XIcon className="h-3 w-3 text-blue-700" aria-hidden="true" />
            }
            onClick={() => onClick(element.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default TagGroup;
