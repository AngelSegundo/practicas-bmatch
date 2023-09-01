import { createColumnHelper } from "@tanstack/react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Table, Button, InputText, Chip, ChipProps } from "ui";
import Spinner from "ui/Spinner";
import { LightningBoltIcon } from "@heroicons/react/outline";
import {
  Service,
  ServiceDTO,
  ServiceStatus,
  ServiceType,
} from "domain/entities";
import DotIcon from "../../icons/DotIcon";
import { useGetCountriesQuery } from "../../store/services/country";
import Image from "next/image";
import ModalCreateService from "../ModalCreateService";
import {
  useServiceSaveMutation,
  useServiceUpdateMutation,
  useUpdateLogoMutation,
} from "../../store/services/service";
import ModalEditService from "../ModalEditService";
import { useGetServiceConnectionsQuery } from "../../store/services/service-connections";

interface ServiceTableProps {
  data: ServiceDTO[];
  isLoading?: boolean;
  mainView?: boolean;
}

const ServiceTable: FunctionComponent<ServiceTableProps> = ({
  data,
  isLoading,
  mainView = false,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<ServiceDTO>();

  const typeStatus: { [key: string]: ChipProps } = {
    [ServiceStatus.pending]: {
      label: "Pendiente",
      template: "warning",
    },
    [ServiceStatus.active]: {
      label: "Activo",
      template: "success",
    },
    [ServiceStatus.inactive]: {
      label: "Inactivo",
      template: "error",
    },
  };

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
  const [newService] = useServiceSaveMutation();
  const [updateService] = useServiceUpdateMutation();
  const [updateLogo] = useUpdateLogoMutation();

  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
  const {
    data: serviceConnections = [],
    isLoading: isServiceConnectionsLoading,
  } = useGetServiceConnectionsQuery();

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
      columnHelper.accessor((row) => row.id, {
        id: "name",
        header: () => "Name",
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
            <p className="text-sm  leading-5 font-medium text-gray-600 w-fit">
              {props.row.original.name}
            </p>
          </div>
        ),
      }),

      //--- columna de Usuarios por servicios---- //
      columnHelper.accessor((row) => row.id, {
        id: "users",
        header: () => "Users",
        cell: (props) => (
          <div className="flex flex-row items-center space-x-3">
            {}
            <p className="text-sm  leading-5 font-medium text-gray-600 w-fit">
              {
                serviceConnections.filter(
                  (connection) =>
                    connection.serviceId === props.row.original.id &&
                    connection.status === "active"
                ).length
              }
            </p>
          </div>
        ),
      }),

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
      columnHelper.accessor("status", {
        header: () => "Estado",
        cell: (item) => (
          <Chip
            label={typeStatus[item.getValue()].label}
            template={typeStatus[item.getValue()].template}
            isSquare={true}
          />
        ),
      }),
      columnHelper.accessor((row) => row.id, {
        id: "edit",
        header: () => "",
        cell: (item) => (
          <div
            onClick={() => {
              setServiceIdToUpdate(item.row.original.id);
            }}
            className="flex flex-1 align-center"
          >
            <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
              Edit
            </p>
          </div>
        ),
      }),
    ];
  }, [
    isCountryOptionsLoading,
    JSON.stringify(countries),
    JSON.stringify(serviceConnections),
  ]);

  const [openModalCreateService, setOpenModalCreateService] =
    useState<boolean>(false);
  const [serviceIdToUpdate, setServiceIdToUpdate] = useState<string | null>();
  const [serviceToUpdate, setServiceToUpdate] = useState<ServiceDTO | null>(
    null
  );

  useEffect(() => {
    if (serviceIdToUpdate && data) {
      const service = data.find((service) => service.id === serviceIdToUpdate);
      if (service) {
        setServiceToUpdate(service);
      }
    }
  }, [serviceIdToUpdate, JSON.stringify(data)]);

  const serviceSave = async (serviceInfo: {
    service: Service;
    serviceLogo: File | null;
  }) => {
    const { id } = await newService(serviceInfo.service).unwrap();
    if (serviceInfo.serviceLogo) {
      const formData = new FormData();
      formData.append("logo", serviceInfo.serviceLogo);
      await updateLogo({
        id: id,
        data: formData,
      }).unwrap();
    }
  };

  const onServiceUpdate = async (serviceInfo: {
    service: Partial<Service>;
    serviceLogo: File | null;
  }) => {
    if (!serviceToUpdate) return;
    delete serviceInfo.service.helperImages;
    const { id } = await updateService({
      id: serviceToUpdate.id,
      data: serviceInfo.service,
    }).unwrap();
    if (serviceInfo.serviceLogo) {
      const formData = new FormData();
      formData.append("logo", serviceInfo.serviceLogo);
      await updateLogo({
        id: id,
        data: formData,
      }).unwrap();
    }
  };

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
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
              label="Create Service"
              onClick={() => setOpenModalCreateService(true)}
              customClassName="w-full"
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading services</h6>
          </div>
        </div>
      ) : (
        <>
          <div className="w-all flex-1">
            {data.length <= 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
                <LightningBoltIcon className="text-gray-500 h-12 w-12" />
                <p className="text-base text-center leading-7 font-normal text-gray-500">
                  No services yet
                </p>
                <Button
                  type="button"
                  template="bmatch-primary"
                  label="Add services"
                  onClick={() => setOpenModalCreateService(true)}
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
          <ModalCreateService
            openModalCreateService={openModalCreateService}
            onClickCreateService={() => setOpenModalCreateService(false)}
            onSubmitService={serviceSave}
          />
          {serviceToUpdate !== null && (
            <ModalEditService
              openModalEditService={serviceToUpdate !== null}
              onCloseModal={() => (setServiceToUpdate(null), setServiceIdToUpdate(null)) }
              onSubmitEditService={onServiceUpdate}
              service={serviceToUpdate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ServiceTable;
