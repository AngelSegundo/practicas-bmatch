import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Table, Button } from "ui";
import Spinner from "ui/Spinner";
import {
  ServiceConnectionDTO,
  ServiceReading,
  ServiceReadingDTO,
} from "domain/entities";
import ModalReadingDetail from "../ModalReadingDetail";
import {
  useAddServiceReadingMutation,
  useChangeServiceReadingValueMutation,
} from "../../store/services/service-readings";
import { showAlert } from "../../store/slices/notifications";
import { useAppDispatch } from "../../store/root";

interface ServiceReadingsTableProps {
  data?: ServiceReadingDTO[];
  isLoading?: boolean;
  connection: ServiceConnectionDTO;
}

const ServiceReadingsTable: FunctionComponent<ServiceReadingsTableProps> = ({
  data,
  isLoading,
  connection,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<ServiceReadingDTO>();
  const [
    addServiceReading,
    { isLoading: isAddServiceReadingLoading, data: serviceReadingData },
  ] = useAddServiceReadingMutation();
  const [
    changeServiceReadingValue,
    {
      isLoading: isChangeServiceReadingValueLoading,
      data: changeServiceReadingValueData,
    },
  ] = useChangeServiceReadingValueMutation();
  const dueDate = (date: string) => {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };
  const [openModalReadingDetail, setOpenModalReadingDetail] = useState<{
    isOpen: boolean;
    reading: ServiceReadingDTO | undefined;
  }>({
    isOpen: false,
    reading: undefined,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isChangeServiceReadingValueLoading) return;
    if (!isChangeServiceReadingValueLoading && changeServiceReadingValueData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The reading has been updated.",
        })
      );
      setOpenModalReadingDetail({ isOpen: false, reading: undefined });
    }
  }, [changeServiceReadingValueData, isChangeServiceReadingValueLoading]);
  useEffect(() => {
    if (isAddServiceReadingLoading) return;
    if (!isAddServiceReadingLoading && serviceReadingData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The reading has been added.",
        })
      );
      setOpenModalReadingDetail({ isOpen: false, reading: undefined });
    }
  }, [serviceReadingData, isAddServiceReadingLoading]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("readingDate", {
        header: () => "Fecha de lectura",
        cell: (props) => (
          <p className="text-sm leading-5 font-medium text-gray-600 cursor-pointer w-fit">
            {dueDate(props.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: "data",
        header: () => "Volume",
        cell: (props) => (
          <p className="text-sm leading-5 font-medium text-gray-600 cursor-pointer w-fit">
            {props.getValue().value} {props.getValue().unit}
          </p>
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: "view",
        header: () => "",
        cell: (props) => (
          <div className="flex flex-1 justify-center align-center">
            <button
              onClick={() => {
                setOpenModalReadingDetail({
                  isOpen: true,
                  reading: props.getValue() as ServiceReadingDTO,
                });
              }}
            >
              <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
                View reading
              </p>
            </button>
          </div>
        ),
      }),
    ];
  }, []);

  const initialColumnSort = {
    id: "readingDate",
    desc: true,
  };

  const onSubmitReading = async (
    reading: ServiceReading,
    isAnUpdate: boolean,
    id?: string
  ) => {
    if (id) {
      changeServiceReadingValue({ id, value: reading.value });
    } else {
      if (connection?.id) {
        await addServiceReading({
          connectionId: connection.id,
          data: reading,
        }).unwrap();
      }
    }
  };

  return (
    <div className="mt-6 pb-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
      <div className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
        <div className="w-full flex flex-col flex-1">
          {isLoading ? (
            <div className="w-all flex-1 items-center justify-center flex">
              <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
                <Spinner />
                <h6 className="text-sm leading-5 font-normal">
                  Loading readings
                </h6>
              </div>
            </div>
          ) : (
            <div className="w-all flex-1">
              {!data || data.length <= 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
                  <p className="text-base text-center leading-7 font-normal text-gray-500">
                    No readings yet
                  </p>
                  <Button
                    type="button"
                    template="bmatch-primary"
                    label="Add services"
                    onClick={() => {}}
                    customClassName="w-fit"
                  />
                </div>
              ) : (
                <>
                  <Table
                    rows={data}
                    columns={columns}
                    filter={filter}
                    onChangeFilter={setFilter}
                    initialColumnSort={initialColumnSort}
                    isDense={true}
                  />
                  <ModalReadingDetail
                    openModalReadingDetail={openModalReadingDetail.isOpen}
                    onClickReadingDetail={() => {
                      return setOpenModalReadingDetail({
                        isOpen: false,
                        reading: undefined,
                      });
                    }}
                    onSubmitReading={onSubmitReading}
                    connection={connection}
                    reading={openModalReadingDetail.reading}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceReadingsTable;
