import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { InputText, Table, Button } from "ui";
import Spinner from "ui/Spinner";
import ModalCreateGoal from "../ModalCreateGoal";
import { ReceiptTaxIcon } from "@heroicons/react/outline";
import { Goal, GoalDTO, ServiceType } from "domain/entities";
import { useAppDispatch } from "../../store/root";

import { useGetCountriesQuery } from "../../store/services/country";
import { useGoalSaveMutation } from "../../store/services/goal";
import Link from "next/link";
import { showAlert } from "../../store/slices/notifications";
import DotIcon from "../../icons/DotIcon";

interface GoalTableProps {
  data: GoalDTO[];
  isLoading?: boolean;
  mainView?: boolean;
}

const GoalsTable: FunctionComponent<GoalTableProps> = ({
  data,
  isLoading,
  mainView = false,
}) => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("");
  const [openModalCreateGoal, setOpenModalCreateGoal] =
    useState<boolean>(false);
  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
  const columnHelper = createColumnHelper<GoalDTO>();
  const [newGoal, { isLoading: isNewGoalSaveLoading, data: newGoalData }] =
    useGoalSaveMutation();
  const goalSave = async (goal: Goal) => {
    await newGoal(goal).unwrap();
  };
  useEffect(() => {
    if (isNewGoalSaveLoading) return;
    if (!isNewGoalSaveLoading && newGoalData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The goal has been created.",
        })
      );
      setOpenModalCreateGoal(false);
    }
  }, [newGoalData, isNewGoalSaveLoading]);

  const typeServices = {
    [ServiceType.water]: {
      label: "Water",
      icon: <DotIcon aria-hidden="true" />,
    },
    [ServiceType.gas]: {
      label: "Gas",
      icon: <DotIcon aria-hidden="true" color={"#FF6133"} />,
    },
    [ServiceType.electricity]: {
      label: "Electricity",
      icon: <DotIcon aria-hidden="true" color={"#FFD133"} />,
    },
    [ServiceType.freeway]: {
      label: "FreeWay",
      icon: <DotIcon aria-hidden="true" color={"#0000"} />,
    },
  };

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("type", {
        header: () => "Type",
        cell: (props) => (
          <div className="flex flex-row space-x-3">
            {typeServices[props.getValue()].icon}
            <p className="text-sm leading-5 font-medium text-gray-600 cursor-pointer w-fit">
              {typeServices[props.getValue()].label}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("value", {
        header: () => "Goal",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}%
          </div>
        ),
      }),
      columnHelper.accessor("updatedAt", {
        header: () => "Updated at",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue().slice(8, 10)}
            {props.getValue().slice(4, 8)}
            {props.getValue().slice(0, 4)} {props.getValue().slice(-10, -2)}
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.id, {
        id: "edit",
        header: () => "",
        cell: (item) => (
          <div className="flex flex-1 align-center">
            <Link href={`/goals/${item.row.original.id}`}>
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
              <div className="flex flex-col">
                <h1 className="text-2xl leading-8 font-semibold">Goals</h1>
                <p className="text-base text-center leading-7 font-normal text-gray-500"></p>
              </div>
            ) : (
              <div className="flex flex-col">
                <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                  Goals
                </h3>
                <p className="text-base text-center leading-7 font-normal text-gray-500"></p>
              </div>
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
            
            {/* <Button
              type="button"
              template="bmatch-primary"
              label="Create Goal"
              onClick={() => setOpenModalCreateGoal(true)}
              customClassName="w-full"
            /> */}
          </div>
        </div>
      </div>
      <ModalCreateGoal
        onClickCreateGoal={() => setOpenModalCreateGoal(false)}
        openModalCreateGoal={openModalCreateGoal}
        onSubmitGoal={goalSave}
        isLoading={false}
      />
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading goals</h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <ReceiptTaxIcon className="text-gray-500 h-12 w-12" />
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No goals yet
              </p>
              {/* <Button
                type="button"
                template="bmatch-primary"
                label="Create Goal"
                onClick={() => setOpenModalCreateGoal(true)}
                customClassName="w-fit"
              /> */}
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

export default GoalsTable;
