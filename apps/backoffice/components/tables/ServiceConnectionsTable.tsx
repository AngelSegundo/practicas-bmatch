import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Table, Button, InputText, ChipProps, Chip } from "ui";
import Spinner from "ui/Spinner";
import { LightningBoltIcon } from "@heroicons/react/solid";
import { useGetServiceByCountryQuery } from "../../store/services/service";
import {
  ServiceConnectionDTO,
  ServiceConnectionStatus,
  ServiceType,
} from "domain/entities";
import DotIcon from "../../icons/DotIcon";
import ModalServiceReadings from "../ModalServiceReadings";
import Image from "next/image";

interface ServiceConnectionsTableProps {
  data: ServiceConnectionDTO[];
  isLoading?: boolean;
  countryId: string;
  mainView?: boolean;
}

const ServiceConnectionsTable: FunctionComponent<
  ServiceConnectionsTableProps
> = ({ data, isLoading, countryId, mainView = false }) => {
  const [filter, setFilter] = useState("");
  // todo fix this typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columnHelper = createColumnHelper<any>();

  const { data: services, isLoading: isServiceLoading } =
    useGetServiceByCountryQuery(countryId);

  const [serviceConnectionData, setServiceConnectionData] = useState<ServiceConnectionDTO[]>([]);

  useEffect(() => {
    if (isServiceLoading) return;
    if (!isServiceLoading && services) {
      const serviceConnectionDataMaped = data.map((serviceConnection) => {
        const currentServices = services.find(
          (el) => el.id == serviceConnection.serviceId
        );
        return {
          ...serviceConnection,
          name: currentServices?.name,
          logo: currentServices?.logo,
        };
      });
      setServiceConnectionData(() => {
        return serviceConnectionDataMaped;
      });
    }
  }, [isServiceLoading, JSON.stringify(data)]);

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
  const columns = useMemo(() => {
    return [
      columnHelper.accessor((row) => row, {
        id: "serviceName",
        header: () => "Service",
        cell: (props) => (
          <div className="flex flex-row items-center space-x-3">
            {props.row.original.logo ? (
              <Image
                src={props.row.original.logo as string}
                unoptimized={true}
                alt="logo del servicio"
                width={28}
                height={28}
                objectFit="contain"
                className="flex items-center justify-center flex-shrink-0 rounded-full p-1"
              />
            ) : (
              <div className="flex items-center justify-center text-white h-7 w-7 text-2xl bg-gray-300 hover:bg-gray-300 flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2">
                <span className="uppercase">{""}</span>
              </div>
            )}
            <button
              onClick={() => {
                setOpenModalServiceReadings({
                  isOpen: true,
                  connection: props.getValue() as ServiceConnectionDTO,
                  serviceName: props.getValue().name,
                  serviceLogo: props.row.original.logo,
                });
              }}
            >
              <p className="text-sm  leading-5 font-medium text-gray-600 w-fit">
                {props.getValue().name}
              </p>
            </button>
          </div>
        ),
      }),
      columnHelper.accessor("type", {
        header: () => "Type",
        cell: (props) => (
          <div className="flex flex-row space-x-3">
            {typeServices[props.getValue() as ServiceType].icon}
            <p className="text-sm leading-5 font-medium text-gray-600 w-fit">
              {typeServices[props.getValue() as ServiceType].label}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("alias", {
        header: () => "Alias",
        cell: (props) => (
          <p className="text-sm leading-5 font-medium text-gray-600 w-fit">
            {props.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor("status", {
        header: () => "Status",
        cell: (props) => (
          <Chip
            label={typeStatus[props.getValue()].label}
            template={typeStatus[props.getValue()].template}
            isSquare={true}
          />
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: "view",
        header: () => "",
        cell: (props) => (
          <div className="flex flex-1 justify-center align-center">
            <button
              onClick={() => {
                setOpenModalServiceReadings({
                  isOpen: true,
                  connection: props.getValue() as ServiceConnectionDTO,
                  serviceName: props.getValue().name,
                  serviceLogo: props.row.original.logo,
                });
              }}
            >
              {props.getValue().status !== ServiceConnectionStatus.pending && (
                <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
                  View readings
                </p>
              )}
            </button>
          </div>
        ),
      }),
    ];
  }, []);

  const [openModalServiceReadings, setOpenModalServiceReadings] = useState<{
    isOpen: boolean;
    connection: ServiceConnectionDTO | undefined;
    serviceName: string;
    serviceLogo: string | undefined;
  }>({
    isOpen: false,
    connection: undefined,
    serviceName: "",
    serviceLogo: undefined,
  });

  return (
    <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-2 gap-x-4">
      <div className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
        <div className="w-full flex flex-col flex-1">
          <div className="items-center flex justify-between ">
            <div className="flex items-start w-full">
              {mainView ? (
                <h1 className="text-2xl leading-8 font-semibold">Services</h1>
              ) : (
                <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                  Services
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
                  label="Add service connection"
                  onClick={() => {}}
                  customClassName="w-full"
                />
              </div>
            </div>
          </div>
          {isLoading && isServiceLoading ? (
            <div className="w-all flex-1 items-center justify-center flex">
              <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
                <Spinner />
                <h6 className="text-sm leading-5 font-normal">
                  Loading services
                </h6>
              </div>
            </div>
          ) : (
            <div className="w-all flex-1">
              {serviceConnectionData.length <= 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
                  <LightningBoltIcon className="text-gray-500 h-12 w-12" />
                  <p className="text-base text-center leading-7 font-normal text-gray-500">
                    No services yet
                  </p>
                  <Button
                    type="button"
                    template="bmatch-primary"
                    label="Add service connection"
                    onClick={() => {}}
                    customClassName="w-fit"
                  />
                </div>
              ) : (
                <>
                  <Table
                    rows={serviceConnectionData}
                    columns={columns}
                    filter={filter}
                    onChangeFilter={setFilter}
                  />
                  <ModalServiceReadings
                    onClickServiceReadings={() => {
                      return setOpenModalServiceReadings({
                        isOpen: false,
                        connection: undefined,
                        serviceName: "",
                        serviceLogo: undefined,
                      });
                    }}
                    openModalServiceReadings={openModalServiceReadings.isOpen}
                    connection={openModalServiceReadings.connection}
                    serviceName={openModalServiceReadings.serviceName}
                    serviceLogo={openModalServiceReadings.serviceLogo}
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

export default ServiceConnectionsTable;
