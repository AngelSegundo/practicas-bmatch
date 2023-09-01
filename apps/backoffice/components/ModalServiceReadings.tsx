import { PlusIcon, TrashIcon, XIcon } from "@heroicons/react/solid";
import {
  ServiceConnectionDTO,
  ServiceConnectionStatus,
  ServiceReading,
} from "domain/entities";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button, Chip, ChipProps, Modal } from "ui";
import {
  useAddServiceReadingMutation,
  useChangeServiceReadingValueMutation,
  useLazyGetServiceReadingsByConnectionIdQuery,
} from "../store/services/service-readings";
import ServiceReadingsTable from "./tables/ServiceReadingsTable";
import Image from "next/image";
import ModalReadingDetail from "./ModalReadingDetail";
import { useAppDispatch } from "../store/root";
import { showAlert } from "../store/slices/notifications";
import { ModalDeleteWarning } from "./ModalDeleteWarning";
import { useDeleteServiceConnectionMutation } from "../store/services/service-connections";

interface ModalServiceReadingsProps {
  openModalServiceReadings: boolean;
  onClickServiceReadings: () => void;
  connection?: ServiceConnectionDTO;
  serviceName: string;
  serviceLogo: string | undefined;
}

const ModalServiceReadings: FunctionComponent<ModalServiceReadingsProps> = ({
  openModalServiceReadings,
  onClickServiceReadings,
  connection,
  serviceName,
  serviceLogo,
}) => {
  const [
    getServicesReading,
    { data: servicesReadings, isLoading: isServiceReadingsLoading },
  ] = useLazyGetServiceReadingsByConnectionIdQuery();
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
  const [openModalAddReading, setOpenModalAddReading] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [deleteServiceConnection, { isSuccess: isDeleteSuccess }] =
    useDeleteServiceConnectionMutation();

  const typeStatus: { [key: string]: ChipProps } = {
    [ServiceConnectionStatus.pending]: {
      label: "Pendiente",
      template: "warning",
    },
    [ServiceConnectionStatus.active]: {
      label: "Activo",
      template: "success",
    },
    [ServiceConnectionStatus.cancel]: {
      label: "Cancelado",
      template: "error",
    },
  };
  const date = useMemo(() => {
    if (!connection || !connection.createdAt) return "";
    getServicesReading(connection.id);
    const [year, month, day] = connection.createdAt.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }, [connection?.updatedAt]);
  const [
    openModalDeleteConnectionWarning,
    setOpenModalDeleteConnectionWarning,
  ] = useState<boolean>(false);
  const onSubmitReading = async (
    reading: ServiceReading,
    isAnUpdate: boolean,
    id?: string
  ) => {
    if (id) {
      changeServiceReadingValue({
        id,
        value: parseInt(reading.value as unknown as string),
      });
    } else {
      if (connection?.id) {
        await addServiceReading({
          connectionId: connection.id,
          data: reading,
        }).unwrap();
      }
    }
  };
  useEffect(() => {
    if (isChangeServiceReadingValueLoading) return;
    if (!isChangeServiceReadingValueLoading && changeServiceReadingValueData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The reading has been updated.",
        })
      );
      setOpenModalAddReading(false);
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
      setOpenModalAddReading(false);
    }
  }, [serviceReadingData, isAddServiceReadingLoading]);

  function onDeleteConnection() {
    if (connection) deleteServiceConnection(connection.id);
  }

  useEffect(() => {
    if (isDeleteSuccess === false) return;
    else {
      setOpenModalDeleteConnectionWarning(false);
      dispatch(
        showAlert({
          template: "success",
          text: "Se ha eliminado la conexión al servicio correctamente.",
        })
      );
      onClickServiceReadings();
    }
  }, [isDeleteSuccess]);

  return (
    <Modal
      isOpen={openModalServiceReadings}
      onClose={onClickServiceReadings}
      size="5xl"
      bg="bg-white"
    >
      {connection ? (
        <div className="flex-1 w-full rounded-md flex flex-col ">
          <div className="flex flex-col mx-8 mt-8 space-y-3 justify-end">
            <div className="flex flex-row justify-between pb-2">
              <div className="flex flex-row space-x-3">
                {serviceLogo ? (
                  <Image
                    src={serviceLogo}
                    unoptimized={true}
                    alt="logo del servicio"
                    width={32}
                    height={32}
                    objectFit="contain"
                    className="flex items-center justify-center flex-shrink-0 rounded-full p-1"
                  />
                ) : (
                  <div className="flex items-center justify-center text-white h-8 w-8 text-2xl bg-gray-300 hover:bg-gray-300 flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2">
                    <span className="uppercase">{""}</span>
                  </div>
                )}
                <p className="text-2xl leading-8 font-semibold">
                  {serviceName}
                </p>
              </div>
              <XIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
                role="button"
                onClick={() => {
                  onClickServiceReadings();
                }}
              />
            </div>
            <div className="flex flex-col justify-between gap-3">
              <div className="flex flex-row items-center text-sm leading-5 font-normal space-x-10">
                <div className="flex flex-row  text-sm leading-5 font-normal text-gray-700 space-x-3">
                  <p>Status </p>
                  <Chip
                    label={typeStatus[connection.status].label}
                    template={typeStatus[connection.status].template}
                    isSquare={true}
                  />
                </div>
                <div className="flex flex-row text-sm leading-5 font-normal space-x-3">
                  <p className="text-gray-700 ">Last Update </p>
                  <p className="text-gray-500">{date} </p>
                </div>
                <div className="flex flex-row text-sm leading-5 font-normal space-x-3">
                  <p className="text-gray-700 ">Readings </p>
                  <p className="text-gray-500">{servicesReadings?.length} </p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-3">
                <Button
                  template="bmatch-primary"
                  customClassName="w-fit"
                  label={"Add reading"}
                  type="submit"
                  icon={<PlusIcon className="h-4 w-4 mr-2" />}
                  onClick={() => setOpenModalAddReading(true)}
                />
                {/* <Button
                  template="bmatch-secondary"
                  customClassName="w-fit"
                  label={"DownLoad"}
                  type="submit"
                  icon={<DocumentDownloadIcon className="h-4 w-4 mr-2" />}
                  onClick={() => {}}
                /> */}
                <Button
                  template="danger"
                  customClassName="w-fit"
                  label={"Delete Connection"}
                  type="submit"
                  icon={<TrashIcon className="h-4 w-4 mr-2" />}
                  onClick={() => setOpenModalDeleteConnectionWarning(true)}
                />
              </div>
            </div>
          </div>
          {!isServiceReadingsLoading && (
            <>
              <div className="w-all px-4 flex flex-col flex-1 h-80 overflow-y-scroll">
                <div className="w-all flex-1">
                  <ServiceReadingsTable
                    data={servicesReadings}
                    isLoading={isServiceReadingsLoading}
                    connection={connection}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-6 m-8 border-t py-4">
                <div className="flex flex-row justify-end pb-2 space-x-3">
                  <Button
                    template="bmatch-primary"
                    customClassName="w-fit"
                    label={"Exit"}
                    type="submit"
                    onClick={() => {
                      onClickServiceReadings();
                    }}
                  />
                </div>
              </div>
              <ModalReadingDetail
                openModalReadingDetail={openModalAddReading}
                onClickReadingDetail={() => setOpenModalAddReading(false)}
                onSubmitReading={onSubmitReading}
                connection={connection}
                readings={servicesReadings}
              />
              <ModalDeleteWarning
                isOpen={openModalDeleteConnectionWarning}
                title="Eliminar todos los datos del servicio de conexión"
                cancelActionLabel="Cancelar"
                closeActionLabel="Eliminar"
                onCancel={() => setOpenModalDeleteConnectionWarning(false)}
                onAccept={() => {
                  if (connection) onDeleteConnection();
                }}
              >
                <p className="mt-3 text-sm leading-5 font-normal text-gray-600">
                  Vas a eliminar los datos y todas las lecturas de la conexión
                  al servicio de forma definitiva. Esta acción no puede
                  reestablecerse. ¿Estás de acuerdo?
                </p>
              </ModalDeleteWarning>
            </>
          )}
        </div>
      ) : (
        <div className="w-full rounded-md h-3/6	max-h-full min-h-max">
          <div className="flex flex-col mt-4 m-8">
            <div className="flex flex-row justify-between pb-2">
              <p className="text-xl leading-8 font-semibold">{serviceName}</p>
              <XIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
                role="button"
                onClick={() => {
                  onClickServiceReadings();
                }}
              />
            </div>
          </div>
          <div className=" flex flex-col mt-4 m-8 border-t py-4">
            <div className="flex flex-row justify-end pb-2 space-x-3">
              <Button
                template="default"
                customClassName="w-fit"
                label={"Exit"}
                type="submit"
                onClick={() => {
                  onClickServiceReadings();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalServiceReadings;
