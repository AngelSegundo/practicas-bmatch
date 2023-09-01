import { FunctionComponent, useMemo, useState } from "react";
import { Table } from "ui";
import { InvitationForm } from "domain/entities";
import { XIcon } from "@heroicons/react/solid";
import { createColumnHelper } from "@tanstack/react-table";
interface InvitationTableProps {
  invitations: InvitationForm[];
  onRemoveInvitationClick: (taxId: string) => void;
  taxIdLabel?: string;
}

const InvitationTable: FunctionComponent<InvitationTableProps> = ({
  invitations,
  onRemoveInvitationClick,
  taxIdLabel,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<InvitationForm>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor((row) => `${row.name} ${row.surname}`, {
        id: "fullName",
        header: () => "User",
        cell: (item) => (
          <>
            <p className="text-sm leading-5 font-medium text-gray-900 cursor-pointer w-fit">
              {item.getValue()}
            </p>
            <p className="text-sm leading-5 font-medium text-gray-500 cursor-pointer w-fit">
              {item.row.original.email}
            </p>
          </>
        ),
      }),
      columnHelper.accessor((row) => row.taxId, {
        id: "taxId",
        header: () => taxIdLabel,
        cell: (item) => (
          <p className="text-sm leading-5 font-medium text-gray-900 cursor-pointer w-fit">
            {item.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor((row) => row.taxId, {
        id: "delete",
        header: () => "",
        cell: (item) => (
          <div className="flex flex-1 justify-center align-center pr-8">
            <button className="top-0 right-0 -mr-12 pt-2">
              <p className="text-sm leading-5 font-medium text-gray-500 cursor-pointer w-fit"></p>
              <XIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
                onClick={() => onRemoveInvitationClick(item.getValue())}
              />
            </button>
          </div>
        ),
      }),
    ];
  }, []);

  return (
    <div className="max-h-96 w-112 flex flex-col flex-1">
      <div className="overflow-x-hidden overflow-y-scroll mt-6">
        {invitations.length > 0 && (
          <Table
            rows={invitations}
            columns={columns}
            filter={filter}
            onChangeFilter={setFilter}
            isDense={true}
          />
        )}
      </div>
    </div>
  );
};

export default InvitationTable;
