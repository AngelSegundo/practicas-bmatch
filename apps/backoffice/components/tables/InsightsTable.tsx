import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Table, Button, InputText } from "ui";
import Spinner from "ui/Spinner";
import { LightningBoltIcon } from "@heroicons/react/outline";
import { Insight, InsightDTO } from "domain/entities";
import { useGetCountriesQuery } from "../../store/services/country";
import ModalCreateInsight from "../ModalCreateInsight";
import {
  useInsightUpdateMutation,
  useInsightSaveMutation,
} from "../../store/services/insight";
import ModalEditInsight from "../ModalEditInsight";
interface InsightTableProps {
  data: InsightDTO[];
  isLoading?: boolean;
  mainView?: boolean;
}

const InsightTable: FunctionComponent<InsightTableProps> = ({
  data,
  isLoading,
  mainView = false,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<InsightDTO>();

  const [newInsight] = useInsightSaveMutation();
  const [updateInsight] = useInsightUpdateMutation();

  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("level", {
        header: () => "Categoria",
        cell: (props) => (
          <div className="flex flex-row space-x-3">
            <p className="text-sm leading-5 font-medium text-gray-600 cursor-pointer w-fit">
              {props.getValue()}
            </p>
          </div>
        ),
      }),

      columnHelper.accessor("updatedAt", {
        header: () => "Ultima actualización:",
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
        header: () => "Actualizar",
        cell: (item) => (
          <div
            onClick={() => {
              setInsightIdToUpdate(item.row.original.id);
            }}
            className="flex flex-1 align-center"
          >
            <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
              Actualizar
            </p>
          </div>
        ),
      }),
    ];
  }, [isCountryOptionsLoading, JSON.stringify(countries)]);

  const [openModalCreateInsight, setOpenModalCreateInsight] =
    useState<boolean>(false);

  const [insightIdToUpdate, setInsightIdToUpdate] = useState<string | null>();
  const [insightToUpdate, setInsightToUpdate] = useState<InsightDTO | null>(
    null
  );

  useEffect(() => {
    if (insightIdToUpdate && data) {
      const insight = data.find((insight) => insight.id === insightIdToUpdate);
      if (insight) {
        setInsightToUpdate(insight);
      }
    }
  }, [insightIdToUpdate, JSON.stringify(data)]);

  const insightSave = async (insight: Insight) => {
    const { id } = await newInsight(insight).unwrap();
  };

  const onInsightUpdate = async (insight: Insight) => {
    if (!insightToUpdate) return;
    const { id } = await updateInsight({
      id: insightToUpdate.id,
      data: insight,
    }).unwrap();
  };

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
      <div className="items-center flex justify-between ">
        <div className="flex items-start w-full">
          {mainView ? (
            <h1 className="text-2xl leading-8 font-semibold">Insights</h1>
          ) : (
            <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
              Insights
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

            {/* <Button
              type="button"
              template="bmatch-primary"
              label="Añadir"
              onClick={() => setOpenModalCreateInsight(true)}
              customClassName="w-full"
            /> */}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Cargando ideas...</h6>
          </div>
        </div>
      ) : (
        <>
          <div className="w-all flex-1">
            {data.length <= 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
                <LightningBoltIcon className="text-gray-500 h-12 w-12" />
                <p className="text-base text-center leading-7 font-normal text-gray-500">
                  Aún no hay datos
                </p>
                <Button
                  type="button"
                  template="bmatch-primary"
                  label="Añadir ideas..."
                  onClick={() => setOpenModalCreateInsight(true)}
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
          <ModalCreateInsight
            openModalCreateInsight={openModalCreateInsight}
            onClickCreateInsight={() => setOpenModalCreateInsight(false)}
            onSubmitInsight={insightSave}
          />
          {insightToUpdate !== null && (
            <ModalEditInsight
              openModalEditInsight={insightToUpdate !== null}
              onCloseModal={() => (
                setInsightToUpdate(null), setInsightIdToUpdate(null)
              )}
              onSubmitEditInsight={onInsightUpdate}
              insight={insightToUpdate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InsightTable;
