import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Table, Button, InputText } from "ui";
import Link from "next/link";
import Spinner from "ui/Spinner";
import ModalCreateSponsor from "../ModalCreateSponsor";
import { useSponsorSaveMutation } from "../../store/services/sponsor";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import { Sponsor, SponsorDTO } from "domain/entities";
import { useAppDispatch } from "../../store/root";
import { showAlert } from "../../store/slices/notifications";
import router from "next/router";
import { useGetCountriesQuery } from "../../store/services/country";

interface SponsorTableProps {
  data: SponsorDTO[];
  isLoading?: boolean;
  mainView?: boolean;
}

const SponsorsTable: FunctionComponent<SponsorTableProps> = ({
  data,
  isLoading,
  mainView = false,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<SponsorDTO>();
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

  const [
    newSponsor,
    {
      isLoading: isNewSponsorSaveLoading,
      isSuccess: isNewSponsorSaveSuccess,
      data: newSponsorData,
    },
  ] = useSponsorSaveMutation();

  const sponsorSave = async (sponsor: Sponsor) => {
    await newSponsor(sponsor).unwrap();
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isNewSponsorSaveLoading) return;
    if (!isNewSponsorSaveLoading && isNewSponsorSaveSuccess && newSponsorData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The sponsor has been created.",
        })
      );
      router.push(`/sponsors/${newSponsorData.id}`);
    }
  }, [isNewSponsorSaveLoading, isNewSponsorSaveSuccess]);
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
      columnHelper.accessor("commercialName", {
        header: () => "Company",
        cell: (props) => (
          <Link href={`/sponsors/${props.row.original.id}`}>
            <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
              {props.getValue()}
            </p>
          </Link>
        ),
      }),
      columnHelper.accessor("manager", {
        header: () => "Contact",
        cell: (item) => (
          <div className="flex flex-row space-x-1">
            <div>{item.getValue()?.firstName}</div>
            <div>{item.getValue()?.lastName}</div>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.manager?.email, {
        id: "email",
        header: () => "Email",
        cell: (item) => <div className="flex">{item.getValue()}</div>,
      }),
      columnHelper.accessor("commercialName", {
        header: () => "Detail",
        cell: (props) => (
          <Link href={`/sponsors/${props.row.original.id}`}>
            <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
              View
            </p>
          </Link>
        ),
      }),
    ];
  }, [isCountryOptionsLoading, JSON.stringify(countries)]);

  const [openModalCreateSponsor, setOpenModalCreateSponsor] =
    useState<boolean>(false);

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
      <div className="items-center flex justify-between ">
        <div className="flex items-start w-full">
          <div className="flex items-start w-full">
            {mainView ? (
              <h1 className="text-2xl leading-8 font-semibold">Sponsors</h1>
            ) : (
              <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                Sponsors
              </h3>
            )}
          </div>{" "}
        </div>
        <div className="mt-6 flex flex-row self-end w-fit text-right space-y-4 space-y sm:flex-row xl:justify-end sm:space-y-0 sm:space-x-3 xl:mt-0 md:flex-row">
          <div className="flex flex-row items-center gap-x-4 whitespace-nowrap">
            <InputText
              id="searchCompany"
              placeholder="Search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              containerClassName="border-r border-gray-300 pr-4"
              inputClassName="!mt-0 sm:w-48 w-20"
            />
            <Button
              type="button"
              template="bmatch-primary"
              label="Create Sponsor"
              onClick={() => setOpenModalCreateSponsor(true)}
              customClassName="w-full"
            />
          </div>
        </div>
      </div>
      <ModalCreateSponsor
        onClickCreateSponsor={() => setOpenModalCreateSponsor(false)}
        openModalCreateSponsor={openModalCreateSponsor}
        onSubmitSponsor={sponsorSave}
        isLoading={isNewSponsorSaveLoading}
      />
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading sponsors</h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <OfficeBuildingIcon className="text-gray-500 h-12 w-12" />
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No sponsors yet
              </p>
              <Button
                type="button"
                template="bmatch-primary"
                label="Create Sponsor"
                onClick={() => setOpenModalCreateSponsor(true)}
                customClassName="w-fit"
              />
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

export default SponsorsTable;
