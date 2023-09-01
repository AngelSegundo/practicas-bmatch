import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button, InputText, Table } from "ui";
import Spinner from "ui/Spinner";
import ModalCreateReward from "../ModalCreateReward";
import { ReceiptTaxIcon } from "@heroicons/react/outline";
import { Reward, RewardDTO, RewardType } from "domain/entities";
import { useAppDispatch } from "../../store/root";

import { useGetCountriesQuery } from "../../store/services/country";
import {
  useRewardSaveMutation,
  useUpdatePictureMutation,
} from "../../store/services/reward";
import Link from "next/link";
import { showAlert } from "../../store/slices/notifications";

interface RewardTableProps {
  data: RewardDTO[];
  isLoading?: boolean;
  mainView?: boolean;
}

const RewardsTable: FunctionComponent<RewardTableProps> = ({
  data,
  isLoading,
  mainView = false,
}) => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("");
  const [openModalCreateReward, setOpenModalCreateReward] =
    useState<boolean>(false);
  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
  const columnHelper = createColumnHelper<RewardDTO>();
  const [
    newReward,
    { isLoading: isNewRewardSaveLoading, data: newRewardData },
  ] = useRewardSaveMutation();
  const [updatePicture] = useUpdatePictureMutation();

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

  const rewardSave = async (rewardInfo: {
    reward: Reward;
    picture: File | null;
  }) => {
    const { id } = await newReward(rewardInfo.reward).unwrap();
    if (rewardInfo.picture) {
      const formData = new FormData();
      formData.append("picture", rewardInfo.picture);
      await updatePicture({
        id: id,
        data: formData,
      }).unwrap();
    }
  };
  useEffect(() => {
    if (isNewRewardSaveLoading) return;
    if (!isNewRewardSaveLoading && newRewardData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The reward has been created.",
        })
      );
      setOpenModalCreateReward(false);
    }
  }, [newRewardData, isNewRewardSaveLoading]);

  const typeRewards = {
    [RewardType.food]: {
      label: "Food",
    },
    [RewardType.ticket]: {
      label: "Ticket",
    },
    [RewardType.selfCare]: {
      label: "Self Care",
    },
    [RewardType.shopping]: {
      label: "Shopping",
    },
    [RewardType.market]: {
      label: "Market",
    },
    [RewardType.travel]: {
      label: "Travel",
    },
  };
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("countryId", {
        header: () => "Country",
        cell: (props) => {
          const countryName =
            countryOptions && countryOptions[props.getValue() || "chile"]?.code;
          const flag =
            countryOptions &&
            countryOptions[props.getValue() || "chile"]?.flagCode;
          return (
            <div className="flex flex-row space-x-1">
              <div>{countryName}</div>
              <div>{flag}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor("title", {
        header: () => "Title",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("provider.name", {
        header: () => "Company",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}
          </div>
        ),
      }),

      columnHelper.accessor("type", {
        header: () => "Type",
        cell: (props) => (
          <div className="flex flex-row space-x-3">
            <p className="text-sm leading-5 font-medium text-gray-600 w-fit">
              {typeRewards[props.getValue() as RewardType].label}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("discount", {
        header: () => "Discount",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}%
          </div>
        ),
      }),
      //TODO: ESTAS COLUMNAS SE MOSTRARÁN MÁS ADELANTE CUANDO TENGAMOS EN CUENTA EL EXPIRATION DATE

      // columnHelper.accessor("expirationDate", {
      //   header: () => "Expiration date",
      //   cell: (props) => (
      //     <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
      //       {props.getValue()}
      //     </div>
      //   ),
      // }),
      // columnHelper.accessor("isActive", {
      //   header: () => "Status",
      //   cell: (props) => {
      //     const today = new Date().toISOString().slice(0, 10);
      //     if (
      //       props.row.original.expirationDate &&
      //       props.row.original.expirationDate < today
      //     )
      //       return <Chip label="Expired" template="error" isSquare={true} />;
      //     else if (props.getValue() === false) {
      //       return <Chip label="Inactive" template="warning" isSquare={true} />;
      //     } else {
      //       return <Chip label="Active" template="success" isSquare={true} />;
      //     }
      //   },
      // }),
      columnHelper.accessor((row) => row.id, {
        id: "edit",
        header: () => "",
        cell: (item) => (
          <div className="flex flex-1 align-center">
            <Link href={`/rewards/${item.row.original.id}`}>
              <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
                Edit
              </p>
            </Link>
          </div>
        ),
      }),
    ];
  }, [isCountryOptionsLoading, JSON.stringify(countries)]);

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
      <div className="items-center flex justify-between ">
        <div className="flex items-start w-full">
          <div className="flex items-start w-full">
            {mainView ? (
              <h1 className="text-2xl leading-8 font-semibold">Rewards</h1>
            ) : (
              <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                Rewards
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
              label="Create Reward"
              onClick={() => setOpenModalCreateReward(true)}
              customClassName="w-full"
            />
          </div>
        </div>
      </div>
      <ModalCreateReward
        onClickCreateReward={() => setOpenModalCreateReward(false)}
        openModalCreateReward={openModalCreateReward}
        onSubmitReward={rewardSave}
        isLoading={false}
      />
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading rewards</h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <ReceiptTaxIcon className="text-gray-500 h-12 w-12" />
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No rewards yet
              </p>
              <Button
                type="button"
                template="bmatch-primary"
                label="Create Reward"
                onClick={() => setOpenModalCreateReward(true)}
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

export default RewardsTable;
