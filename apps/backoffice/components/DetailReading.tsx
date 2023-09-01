import { FunctionComponent, useEffect, useState } from "react";
import { Button, InputNumber, InputText, LoadingBar, Select } from "ui";
import { Controller, useForm } from "react-hook-form";
import {
  ServiceConnectionDTO,
  ServiceReading,
  ServiceReadingDTO,
} from "domain/entities";
import { useLazyGetServiceReadingPDFQuery } from "../store/services/service-readings";
import { useGetServiceByIdQuery } from "../store/services/service";

const MONTHS = [
  { id: "12", value: "12" },
  { id: "11", value: "11" },
  { id: "10", value: "10" },
  { id: "09", value: "09" },
  { id: "08", value: "08" },
  { id: "07", value: "07" },
  { id: "06", value: "06" },
  { id: "05", value: "05" },
  { id: "04", value: "04" },
  { id: "03", value: "03" },
  { id: "02", value: "02" },
  { id: "01", value: "01" },
];
const YEARS = [
  { id: "2023", value: "2023" },
  { id: "2022", value: "2022" },
  { id: "2021", value: "2021" },
  { id: "2020", value: "2020" },
  { id: "2019", value: "2019" },
  { id: "2018", value: "2018" },
  { id: "2017", value: "2017" },
  { id: "2016", value: "2016" },
  { id: "2015", value: "2015" },
  { id: "2014", value: "2014" },
  { id: "2013", value: "2013" },
  { id: "2012", value: "2012" },
  { id: "2011", value: "2011" },
  { id: "2010", value: "2010" },
];

interface DetailReadingProps {
  readings?: ServiceReadingDTO[];
  reading?: ServiceReadingDTO;
  onSubmitReading: (
    reading: ServiceReading,
    isAnUpdate: boolean,
    id?: string
  ) => Promise<{ data: ServiceReading } | void>;
  isLoading?: boolean;
  serviceKey?: string;
  connection: ServiceConnectionDTO;
}
const DetailReading: FunctionComponent<DetailReadingProps> = ({
  readings,
  reading,
  onSubmitReading,
  isLoading = false,
  connection,
}) => {
  const [isAnUpdate, setIsAnUpdate] = useState<boolean>(reading ? true : false);
  const [readingId, setReadingId] = useState<string | undefined>(
    reading?.id || undefined
  );

  const [triggerGetPDF, resultPDF] = useLazyGetServiceReadingPDFQuery();
  const { data: serviceData } = useGetServiceByIdQuery(connection.serviceId);

  const today = new Date().toISOString();
  const [currentYear, currentMonth] = today.split("-").slice(0, 2);

  const { handleSubmit, control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      serviceId: reading?.serviceId || connection.serviceId,
      serviceConnectionId: reading?.serviceConnectionId || connection.id,
      userId: reading?.userId || connection.userId,
      value: reading?.value || 0,
      unit: connection.type === "electricity" ? "kWh" : "m3",
      year: reading?.year || currentYear,
      month: reading?.month || currentMonth,
    },
  });

  const year = watch("year");
  const month = watch("month");

  useEffect(() => {
    if (reading) return;
    if (month != undefined && year != undefined && readings) {
      const readingFound = readings.find(
        (reading) => reading.month === month && reading.year === year
      );
      if (readingFound) {
        setIsAnUpdate(true);
        setReadingId(readingFound.id);
        setValue("value", readingFound.value);
      } else {
        setIsAnUpdate(false);
        setReadingId(undefined);
        setValue("value", 0);
      }
    }
  }, [month, year]);

  useEffect(() => {
    if (readingId && serviceData?.key) {
      triggerGetPDF({
        serviceReadingId: readingId,
        serviceKey: serviceData.key,
      });
    }
  }, [readingId, serviceData?.key]);

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    const readingData = {
      serviceId: data.serviceId,
      serviceConnectionId: data.serviceConnectionId,
      userId: data.userId,
      scrapperInstance: reading?.scrapperInstance || "",
      value: parseInt(data.value as unknown as string),
      unit: data.unit,
      readingDate:
        reading?.readingDate || `${data?.year}-${data?.month}-01T00:00:00.000Z`,
      month: data.month,
      year: data.year,
      type: connection.type,
      bucketURL: reading?.bucketURL,
    };
    onSubmitReading(readingData, isAnUpdate, readingId);
  });

  return (
    <div className=" grid grid-cols-2 gap-4">
      <div className="mt-2 mb-24 pl-8 flex items-center justify-center">
        {readingId && resultPDF.data?.data ? (
          <Button
            label="Descargar PDF"
            onClick={() => {
              window.open(resultPDF.data?.data as string, "_blank");
            }}
          />
        ) : null}
      </div>
      <form onSubmit={onSubmit}>
        <>
          <div className="mt-8 px-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-2">
            <Controller
              control={control}
              name="year"
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
                  id="year"
                  selectOptions={YEARS}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="flex flex-col"
                  label="Year "
                  disabled={reading != undefined}
                />
              )}
            />
            <Controller
              control={control}
              name="month"
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
                  id="month"
                  selectOptions={MONTHS}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="flex flex-col"
                  label="Month "
                  disabled={reading != undefined}
                />
              )}
            />
            <Controller
              control={control}
              name="value"
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
                <InputNumber
                  id="value"
                  value={value as unknown as string}
                  label="Value"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1 sm:col-start-1"
                />
              )}
            />
            <Controller
              control={control}
              name="unit"
              defaultValue="m3"
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
                  id="unit"
                  disabled={true}
                  value={value}
                  label="Unit"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1 "
                />
              )}
            />
          </div>
          <div className="border-b p-4 mx-6"></div>
          <div className="flex flex-col items-end mt-4 py-3 px-8">
            {isLoading ? (
              <LoadingBar />
            ) : (
              <Button
                template="bmatch-primary"
                customClassName="w-fit"
                label={"Save reading"}
                type="submit"
                onClick={onSubmit}
              />
            )}
          </div>
        </>
      </form>
    </div>
  );
};
export default DetailReading;
