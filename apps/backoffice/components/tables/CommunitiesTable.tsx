import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Table, Button, InputText } from "ui";
import Link from "next/link";
import Spinner from "ui/Spinner";
import Image from "next/image";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import { Community, CommunityDTO, SponsorDTO } from "domain/entities";
import { PlusIcon } from "@heroicons/react/solid";
import ModalCreateCommunity from "../ModalCreateCommunity";
import {
  useCommunitySaveMutation,
  useUpdateLogoMutation,
} from "../../store/services/community";
import { useAppDispatch } from "../../store/root";
import { showAlert } from "../../store/slices/notifications";
import { useGetCountriesQuery } from "../../store/services/country";
import { useGetAllSponsorsQuery } from "../../store/services/sponsor";

interface CommunitiesTableProps {
  data: CommunityDTO[];
  isLoading?: boolean;
  isVisibleHead?: boolean;
  sponsor?: SponsorDTO;
  mainView?: boolean;
}

const CommunitiesTable: FunctionComponent<CommunitiesTableProps> = ({
  data,
  isLoading,
  isVisibleHead = true,
  sponsor,
  mainView = false,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<CommunityDTO>();
  const [
    newCommunity,
    {
      isLoading: isNewCommunitySaveLoading,
      isSuccess: isNewCommunitySaveSuccess,
      data: newCommunityData,
    },
  ] = useCommunitySaveMutation();
  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
  const { data: sponsors = [], isLoading: isSponsorsLoading } =
    useGetAllSponsorsQuery();

  const [updateLogo] = useUpdateLogoMutation();
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
      columnHelper.accessor((row) => row.name, {
        id: "name",
        header: () => "Name",
        cell: (props) => (
          <Link href={`/communities/${props.row.original.id}`}>
            <div className="flex flex-row items-center space-x-3">
              {props.row.original.profilePicture ? (
                <Image
                  src={props.row.original.profilePicture as string}
                  unoptimized={true}
                  alt="logo de compañia"
                  width={40}
                  height={40}
                  objectFit="contain"
                  className="flex items-center justify-center flex-shrink-0 rounded-full p-1"
                />
              ) : (
                <div className="flex items-center justify-center text-white h-10 w-10 text-2xl bg-gray-300 hover:bg-gray-300 flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <span className="uppercase">{""}</span>
                </div>
              )}
              <p className="text-sm  leading-5 font-medium text-blue-600 cursor-pointer w-fit">
                {props.row.original.name}
              </p>
            </div>
          </Link>
        ),
      }),
      columnHelper.accessor("isPublic", {
        header: () => "Type",
        cell: (props) => <div>{props.getValue() ? "Public" : "Private"}</div>,
      }),
      columnHelper.accessor("sponsorName", {
        header: () => "Company",
        cell: (props) => <div>{props.getValue()}</div>,
      }),
      columnHelper.accessor((row) => row.id, {
        id: "edit",
        header: () => "",
        cell: (item) => (
          <div className="flex flex-1 align-center">
            <Link href={`/communities/${item.row.original.id}`}>
              <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
                Edit
              </p>
            </Link>
          </div>
        ),
      }),
    ];
  }, [isCountryOptionsLoading, JSON.stringify(countries)]);

  const communitySave = async (communityInfo: {
    community: Community;
    communityLogo: File | null;
  }) => {
    const { id } = await newCommunity(communityInfo.community).unwrap();
    if (communityInfo.communityLogo) {
      const formData = new FormData();
      formData.append("profilePicture", communityInfo.communityLogo);
      await updateLogo({
        id: id,
        data: formData,
      }).unwrap();
    }
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isNewCommunitySaveLoading) return;
    if (
      !isNewCommunitySaveLoading &&
      isNewCommunitySaveSuccess &&
      newCommunityData
    ) {
      dispatch(
        showAlert({
          template: "success",
          text: "The community has been created.",
        })
      );
      //router.push(`/sponsors/${newCommunityData.id}`);
    }
  }, [isNewCommunitySaveLoading, isNewCommunitySaveSuccess]);

  const [openModalCreateCommunity, setOpenModalCreateCommunity] =
    useState<boolean>(false);

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
      {isVisibleHead && (
        <div className="items-center flex justify-between ">
          <div className="flex items-start w-full">
            {mainView ? (
              <h1 className="text-2xl leading-8 font-semibold">Communities</h1>
            ) : (
              <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                Communities
              </h3>
            )}
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
                label="Create Community"
                onClick={() => setOpenModalCreateCommunity(true)}
                customClassName="w-full"
                icon={<PlusIcon className="h-4 w-4 mr-2" />}
              />
            </div>
          </div>
        </div>
      )}
      {sponsor && (
        <ModalCreateCommunity
          onClickCreateCommunity={() => setOpenModalCreateCommunity(false)}
          openModalCreateCommunity={openModalCreateCommunity}
          onSubmitCommunity={communitySave}
          isLoading={false}
          sponsor={sponsor}
        />
      )}
      {mainView && !isSponsorsLoading && sponsors && (
        <ModalCreateCommunity
          onClickCreateCommunity={() => setOpenModalCreateCommunity(false)}
          openModalCreateCommunity={openModalCreateCommunity}
          onSubmitCommunity={communitySave}
          isLoading={false}
          sponsors={sponsors}
          mainView={mainView}
        />
      )}

      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">
              Loading communities
            </h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <OfficeBuildingIcon className="text-gray-500 h-12 w-12" />
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No communities yet
              </p>
              <Button
                type="button"
                template="bmatch-primary"
                label="Create Community"
                onClick={() => setOpenModalCreateCommunity(true)}
                customClassName="w-fit"
                icon={<PlusIcon className="h-4 w-4 mr-2" />}
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

export default CommunitiesTable;
