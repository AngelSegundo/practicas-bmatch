import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button, InputText, InputTextArea, LoadingBar, Select } from "ui";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Service,
  ServiceDTO,
  ServiceStatus,
  ServiceType,
} from "domain/entities";
import {
  useDeleteServiceHelperImageMutation,
  useUpdateLogoMutation,
  useUploadServiceImageHelperFileMutation,
} from "../store/services/service";
import Image from "next/image";
import { useGetCountriesQuery } from "../store/services/country";
import { XCircleIcon } from "@heroicons/react/solid";

interface DetailServiceProps {
  service?: ServiceDTO;
  onModalClose?: () => void;
  onSubmitService: (serviceInfo: {
    service: Service;
    serviceLogo: File | null;
  }) => Promise<{ data: ServiceDTO; serviceLogo: File | null } | void>;
  isCreateServiceModal?: boolean;
  isLoading?: boolean;
}

const DetailService: FunctionComponent<DetailServiceProps> = ({
  service,
  onModalClose,
  onSubmitService,
  isCreateServiceModal = false,
  isLoading = false,
}) => {
  const [updateLogo] = useUpdateLogoMutation();
  const [uploadImageHelper, { isLoading: isLoadingImageHelper }] =
    useUploadServiceImageHelperFileMutation();

  const [deleteHelperImage] = useDeleteServiceHelperImageMutation();
  const [configState] = useState<
    {
      inputId: string;
      label: string;
      placeholder: string;
      type: string;
    }[]
  >([]);

  const [tipsState] = useState<
    {
      value: string;
    }[]
  >([]);

  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      name: service?.name || "",
      key: service?.key || "",
      countryId: service?.countryId || "",
      type: service?.type || ServiceType.water,
      status: service?.status || ServiceStatus.active,
      logo: service?.logo || "",
      addServiceMessage: service?.addServiceMessage || "",
      config: [{ inputId: "", label: "", placeholder: "", type: "" }],
      helperImages: service?.helperImages || [],
      tips: [{ value: "" }],
    },
  });

  const {
    fields: fieldsConfig,
    append: appendConfig,
    remove: removeConfig,
  } = useFieldArray({
    control,
    name: "config",
  });

  const {
    fields: fieldsTip,
    append: appendTip,
    remove: removeTip,
  } = useFieldArray({
    control,
    name: "tips",
  });

  useEffect(() => {
    if (!service) return;
    reset({
      ...service,
    });
  }, []);

  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
  const COUNTRY_OPTIONS = useMemo(() => {
    if (isCountryOptionsLoading) return;
    if (!isCountryOptionsLoading && countries) {
      const data = countries.map((country) => {
        return {
          value: country.name,
          id: country.id,
        };
      });
      return data;
    }
  }, [isCountryOptionsLoading, countries]);

  const SERVICE_OPTIONS = [
    {
      value: ServiceType.water,
      id: ServiceType.water,
    },
    {
      value: ServiceType.gas,
      id: ServiceType.gas,
    },
    {
      value: ServiceType.electricity,
      id: ServiceType.electricity,
    },
    {
      value: ServiceType.freeway,
      id: ServiceType.freeway,
    },
  ];

  const SERVICE_STATUS_OPTIONS = [
    {
      value: "Active",
      id: "active",
    },
    {
      value: "Inactive",
      id: "inactive",
    },
  ];

  const CONFIG_TYPE_OPTIONS = [
    {
      value: "string",
      id: "string",
    },
    {
      value: "number",
      id: "number",
    },
  ];

  const [serviceLogo, setServiceLogo] = useState<null | File>(null);
  const [serviceImage, setServiceImage] = useState<null | File>(null);

  const handleUploadLogo = async (file: File) => {
    if (!service) return;
    const formData = new FormData();
    formData.append("profilePicture", file);
    const fileData = await updateLogo({
      id: service?.id,
      data: formData,
    }).unwrap();
    reset();
    return fileData;
  };

  const onSelectNewLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setServiceLogo(file);
    handleUploadLogo(file);
  };
  const onSelectNewImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setServiceImage(file);

    const newData: { data: ServiceDTO } = (await handleUploadAttachmentFile(
      file
    )) as unknown as { data: ServiceDTO };

    reset(newData?.data as ServiceDTO);
  };

  const handleUploadAttachmentFile = async (file: File) => {
    if (!service) return;
    const formData = new FormData();
    formData.append("file", file);
    const fileData = await uploadImageHelper({
      id: service?.id,
      data: formData,
    });
    return fileData;
  };

  const onSubmit = handleSubmit(async (data: Service, event) => {
    event?.preventDefault();
    const { logo, ...serviceData } = data;

    onSubmitService({
      service: serviceData,
      serviceLogo: serviceLogo,
    });
    onModalClose?.();
  });

  const handleDeleteHelperImage = async (index: number) => {
    if (!service) return;

    const newServiceData = await deleteHelperImage({
      id: service?.id,
      index: index,
    }).unwrap();

    reset(newServiceData);
  };

  return (
    <form onSubmit={onSubmit}>
      {COUNTRY_OPTIONS && (
        <>
          <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
            <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
              Service data
            </h3>
            {service?.id !== undefined && (
              <div className="sm:col-span-6">
                <Controller
                  control={control}
                  name="status"
                  rules={{
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      id="status"
                      selectOptions={SERVICE_STATUS_OPTIONS}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      containerClassName="max-w-sm focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                      label="Status"
                    />
                  )}
                />
              </div>
            )}
            <Controller
              control={control}
              name="name"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="name"
                  value={value ?? ""}
                  label="Name"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="key"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="key"
                  value={value ?? ""}
                  label="Key"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="type"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <Select
                  id="type"
                  selectOptions={SERVICE_OPTIONS}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                  label="Service Type"
                />
              )}
            />
            <Controller
              control={control}
              name="countryId"
              defaultValue="chile"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <Select
                  id="countryId"
                  selectOptions={COUNTRY_OPTIONS}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                  label="Country ID"
                />
              )}
            />
            <div className="h-all col-span-3 pl-10">
              <p className="block text-base sm:text-sm font-medium text-gray-700">
                Logo del servicio
              </p>
              <div className="flex items-end w-auto space-x-3 pt-2">
                {serviceLogo || service?.logo ? (
                  <Image
                    src={
                      serviceLogo
                        ? URL.createObjectURL(serviceLogo)
                        : (service?.logo as string)
                    }
                    unoptimized={true}
                    alt="logo de service"
                    width={64}
                    height={64}
                    objectFit="contain"
                    className="flex items-center justify-center flex-shrink-0 rounded-full p-1"
                  />
                ) : (
                  <div className="flex items-center justify-center text-white h-16 w-16 text-2xl bg-gray-300 hover:bg-gray-400 flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2">
                    <span className="uppercase">{""}</span>
                  </div>
                )}
                <div className="flex flex-col items-end mt-4 whitespace-nowrap">
                  <label className="group relative flex justify-center items-center px-4 h-10 text-base sm:text-sm font-medium rounded-md focus:outline-none border border-gray-300 text-gray-700 bg-white hover:bg-gray-100">
                    <span>Subir Logo</span>
                    <input
                      id="profilePicture"
                      name="profilePicture"
                      type="file"
                      className="sr-only"
                      onChange={onSelectNewLogo}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <div className="flex flex-row space-x-3">
                <p className="block text-base sm:text-sm font-medium text-gray-700">
                  Configuración
                </p>
              </div>
              <div>
                {fieldsConfig.map((field, index) => {
                  return (
                    <div
                      key={field.id}
                      className="mt-3 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4"
                    >
                      <Controller
                        control={control}
                        name={`config.${index}.inputId`}
                        defaultValue=""
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <InputText
                            id={`config.${index}.inputId`}
                            value={value ?? ""}
                            label="Input ID"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-1"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`config.${index}.label`}
                        defaultValue=""
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <InputText
                            id={`config.${index}.label`}
                            value={value ?? ""}
                            label="Label"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-1"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`config.${index}.placeholder`}
                        defaultValue=""
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <InputText
                            id={`config.${index}.placeholder`}
                            value={value ?? ""}
                            label="Placeholder"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-1"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`config.${index}.type`}
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            id={`config.${index}.type`}
                            selectOptions={CONFIG_TYPE_OPTIONS}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                            label="Type"
                          />
                        )}
                      />
                      <Button
                        customClassName="w-fit mt-6 h-9"
                        label="Remove"
                        type="button"
                        template="danger"
                        onClick={() => removeConfig(index)}
                      />
                    </div>
                  );
                })}
              </div>{" "}
              <Button
                customClassName="w-fit h-9 mt-4"
                label="Add config"
                type="button"
                template="bmatch-primary"
                onClick={() =>
                  appendConfig({
                    inputId: "",
                    label: "",
                    placeholder: "",
                    type: "",
                  })
                }
              />
              {configState.length > 0 &&
                configState.map((config) => {
                  return (
                    <div
                      key={config.inputId}
                      className="mt-3 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4"
                    >
                      <InputText
                        id="currentConfig.inputId"
                        value={config.inputId}
                        label="Input ID"
                        containerClassName="sm:col-span-1"
                        disabled={true}
                      />
                      <InputText
                        id="currentConfig.label"
                        value={config.label}
                        label="Label"
                        disabled={true}
                        containerClassName="sm:col-span-1"
                      />
                      <InputText
                        id="currentConfig.placeholder"
                        value={config.placeholder}
                        label="Placeholder"
                        disabled={true}
                        containerClassName="sm:col-span-1"
                      />
                      <InputText
                        id="currentConfig.type"
                        value={config.type}
                        containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                        label="Type"
                        disabled={true}
                      />
                    </div>
                  );
                })}
            </div>

            <Controller
              control={control}
              name="addServiceMessage"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputTextArea
                  id="addServiceMessage"
                  value={value ?? ""}
                  label="Wellcome Service Message"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  rows={2}
                  containerClassName="sm:col-span-3"
                />
              )}
            />
            <div className="col-span-3 text-base sm:text-sm font-medium text-gray-700 space-y-3">
              <p className="mb-3">
                Sube las imagenes para ayudar a los clientes de este servicio
              </p>
              <label className="border rounded cursor-pointer w-fit h-fit p-2">
                <span>Subir imagen</span>
                <input
                  id="imageHelper"
                  name="imageHelper"
                  type="file"
                  className="sr-only"
                  onChange={onSelectNewImage}
                />
              </label>
              {service?.helperImages && service?.helperImages.length > 0 && (
                <>
                  <div className="my-2">Imagenes subidas:</div>
                  <div className="flex gap-x-2 flex-wrap">
                    {service.helperImages.map((helperImage, index) => {
                      return (
                        <div className="relative" key={helperImage}>
                          <div
                            className="absolute top-1 right-1 z-10 cursor-pointer"
                            onClick={() => handleDeleteHelperImage(index)}
                          >
                            <XCircleIcon className="w-6 h-6" />
                          </div>
                          <Image
                            src={helperImage}
                            unoptimized={true}
                            width={100}
                            height={100}
                            alt={helperImage}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="sm:col-span-6">
              <div className="flex flex-row space-x-3">
                <p className="block text-base sm:text-sm font-medium text-gray-700">
                  Tips de Ahorro
                </p>
              </div>
              <div>
                {fieldsTip.map((tip, index) => {
                  return (
                    <div
                      key={tip.id}
                      className="mt-4 grid sm:grid-cols-2 gap-y-6 gap-x-4"
                    >
                      <Controller
                        control={control}
                        name={`tips.${index}.value`}
                        defaultValue=""
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <InputText
                            id={`tips.${index}`}
                            value={value ?? ""}
                            label={`Tip ${index + 1}`}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-1"
                          />
                        )}
                      />
                      <Button
                        customClassName="w-fit mt-6 h-9"
                        label="Remove"
                        type="button"
                        template="danger"
                        onClick={() => removeTip(index)}
                      />
                    </div>
                  );
                })}
              </div>
              <Button
                customClassName="w-fit h-9 mt-4"
                label="Add tip"
                type="button"
                template="bmatch-primary"
                onClick={() =>
                  appendTip({
                    value: "",
                  })
                }
              />
              {tipsState.length > 0 &&
                tipsState.map((tip, index) => {
                  return (
                    <div
                      key={index}
                      className="mt-3 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4"
                    >
                      <InputText
                        id="currentConfig.inputId"
                        value={tip.value}
                        label={`Tip ${index + 1}`}
                        containerClassName="sm:col-span-1"
                        disabled={true}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="border-b p-4 mx-6"></div>
          <div className="flex flex-col items-end mt-4 py-3 px-8">
            {isLoading ? (
              <LoadingBar />
            ) : (
              <div className="flex flex-row space-x-4">
                {!isCreateServiceModal && (
                  <Button
                    customClassName="w-fit"
                    label="Return"
                    type="button"
                    onClick={() => {
                      history.back();
                    }}
                  />
                )}
                <Button
                  template="bmatch-primary"
                  customClassName="w-fit"
                  label={
                    isCreateServiceModal ? "Create service" : "Save changes"
                  }
                  type="submit"
                  onClick={onSubmit}
                />
              </div>
            )}
          </div>
        </>
      )}
    </form>
  );
};
export default DetailService;
