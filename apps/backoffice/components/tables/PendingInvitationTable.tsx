import { FunctionComponent, useMemo, useState } from "react";
import { Chip, InputText, Table } from "ui";
import Spinner from "ui/Spinner";
import { CommunityDTO, SponsorDTO, InvitationDTO } from "domain/entities";
import { createColumnHelper } from "@tanstack/react-table";
import { useGetCountriesQuery } from "../../store/services/country";
interface PendingInvitationTableProps {
  data: InvitationDTO[];
  isLoading?: boolean;
  sponsor?: SponsorDTO;
  communities?: CommunityDTO[];
  mainView?: boolean;
}

const PendingInvitationTable: FunctionComponent<
  PendingInvitationTableProps
> = ({ data, isLoading, mainView = false }) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<InvitationDTO>();
  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();

  const countryOptions:
    | { [key: string]: { flagCode: string; name: string; code: string } }
    | undefined = useMemo(() => {
    if (isCountryOptionsLoading) return undefined;
    if (!isCountryOptionsLoading && countries) {
      const typeCountry: {
        [key: string]: { flagCode: string; name: string; code: string };
      } = countries.reduce((options, country) => {
        return {
          ...options,
          [country.id]: {
            flagCode: country.flagCode,
            name: country.name,
            code: country.code,
          },
        };
      }, {});
      return typeCountry;
    }
  }, [isCountryOptionsLoading, JSON.stringify(countries)]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("countryId", {
        header: () => "Country",
        cell: (props) => {
          const countryName =
            countryOptions && countryOptions[props.getValue()]?.code;
          const flag =
            countryOptions && countryOptions[props.getValue()]?.flagCode;
          return (
            <div className="flex flex-row space-x-1">
              <div>{countryName}</div>
              <div>{flag}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => `${row.name} ${row.surname}`, {
        id: "fullName",
        header: () => "Invitation",
        cell: (item) => (
          <p className="text-sm leading-5 font-medium text-gray-500 w-fit">
            {item.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor((row) => row.email, {
        id: "email",
        header: () => "Email",
        cell: (item) => (
          <p className="text-sm leading-5 font-medium text-gray-500 w-fit">
            {item.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor((row) => row.email, {
        id: "status",
        header: () => "Status",
        cell: () => (
          <Chip label={"Pending"} template={"warning"} isSquare={true} />
        ),
      }),
    ];
  }, [isCountryOptionsLoading, JSON.stringify(countries)]);

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
      <div className="items-center flex justify-between ">
        {mainView ? (
          <h1 className="text-2xl leading-8 font-semibold">
            Invitations ({data.length})
          </h1>
        ) : (
          <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
            Pending Invitations ({data.length})
          </h3>
        )}
        <div className="mt-6 flex flex-row self-end w-fit text-right sm:flex-row xl:justify-end xl:mt-0 md:flex-row">
          {data.length > 0 && (
            <div className="flex flex-row items-center gap-x-4 whitespace-nowrap">
              <InputText
                id="searchCompany"
                placeholder="Search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                containerClassName="border-gray-300 pr-4"
                inputClassName="!mt-0 sm:w-48 w-20"
              />
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">
              Cargando invitations
            </h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No hay invitaciones pendientes
              </p>
            </div>
          ) : (
            <Table
              rows={data}
              columns={columns}
              filter={filter}
              onChangeFilter={setFilter}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PendingInvitationTable;
