import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button, InputText, Table } from "ui";
import Spinner from "ui/Spinner";
import ModalCreateTip from "../ModalCreateTip";
import { ReceiptTaxIcon } from "@heroicons/react/outline";
import { Tip, TipDTO } from "domain/entities";
import { useAppDispatch } from "../../store/root";
import Image from "next/image";

import { useGetCountriesQuery } from "../../store/services/country";
import {
  useDeleteTipMutation,
  useTipSaveMutation,
} from "../../store/services/tip";
import Link from "next/link";
import { showAlert } from "../../store/slices/notifications";
import { ModalDeleteWarning } from "../ModalDeleteWarning";

interface TipTableProps {
  data: TipDTO[];
  isLoading?: boolean;
  mainView?: boolean;
}

const TipsTable: FunctionComponent<TipTableProps> = ({
  data,
  isLoading,
  mainView = false,
}) => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("");
  const [openModalCreateTip, setOpenModalCreateTip] = useState<boolean>(false);
  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
  const [deleteTip] = useDeleteTipMutation();
  const columnHelper = createColumnHelper<TipDTO>();
  const [newTip, { isLoading: isNewTipSaveLoading, data: newTipData }] =
    useTipSaveMutation();

  const [tipToDelete, setTipToDelete] = useState<TipDTO | null>(null);

  const tipSave = async (data: { tip: Tip; image: File | null }) => {
    await newTip(data.tip).unwrap();
  };
  useEffect(() => {
    if (isNewTipSaveLoading) return;
    if (!isNewTipSaveLoading && newTipData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The tip has been created.",
        })
      );
      setOpenModalCreateTip(false);
    }
  }, [newTipData, isNewTipSaveLoading]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("text", {
        header: () => "Text",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("order", {
        header: () => "Orden",
        cell: (props) => (
          <div className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.id, {
        id: "edit",
        header: () => "",
        cell: (item) => (
          <div className="flex flex-1 align-center">
            <Link href={`/tips/${item.row.original.id}`}>
              <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
                Edit
              </p>
            </Link>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.id, {
        id: "delete",
        header: () => "",
        cell: (item) => (
          <div
            className="flex flex-1 align-center"
            onClick={() => {
              setTipToDelete(item.row.original);
            }}
          >
            <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
              Delete
            </p>
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
              <h1 className="text-2xl leading-8 font-semibold">Tips</h1>
            ) : (
              <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                Tips
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
              label="Create Tip"
              onClick={() => setOpenModalCreateTip(true)}
              customClassName="w-full"
            />
          </div>
        </div>
      </div>
      <ModalCreateTip
        onClickCreateTip={() => setOpenModalCreateTip(false)}
        openModalCreateTip={openModalCreateTip}
        onSubmitTip={tipSave}
        isLoading={false}
      />
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading tips</h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <ReceiptTaxIcon className="text-gray-500 h-12 w-12" />
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No tips yet
              </p>
              <Button
                type="button"
                template="bmatch-primary"
                label="Create Tip"
                onClick={() => setOpenModalCreateTip(true)}
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
      {tipToDelete !== null && (
        <ModalDeleteWarning
          isOpen={tipToDelete !== null}
          onCancel={() => setTipToDelete(null)}
          onAccept={async () => {
            if (tipToDelete) {
              await deleteTip(tipToDelete?.id).unwrap();
            }
            setTipToDelete(null);
          }}
          title={"Delete tip"}
          cancelActionLabel={"Cancelar"}
          closeActionLabel={"Borrar"}
        >
          <p className="text-sm leading-5 font-normal text-gray-500">
            ¿Estás seguro que quieres eliminar este tip?
          </p>
        </ModalDeleteWarning>
      )}
    </div>
  );
};

export default TipsTable;
