import { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Button,
  CheckBox,
  FiltrableOption,
  InputNumber,
  InputText,
  InputTextArea,
  LoadingBar,
  Select,
} from "ui";
import { Controller, useForm } from "react-hook-form";
import {
  Reward,
  RewardDTO,
  RewardType,
  Schedule,
  WeekDay,
} from "domain/entities";
import { useGetCountriesQuery } from "../store/services/country";
import Image from "next/image";
import InputDate from "ui/Inputs/InputDate";
import SelectorMultioptions from "./SelectorMultioptions";
import { useUpdatePictureMutation } from "../store/services/reward";

interface DetailRewardProps {
  reward?: RewardDTO;
  onModalClose?: () => void;
  onSubmitReward: (rewardInfo: {
    reward: Reward;
    picture: File | null;
  }) => Promise<{ data: RewardDTO; picture: File | null } | void>;
  isCreateRewardModal?: boolean;
  isLoading?: boolean;
}
const DetailReward: FunctionComponent<DetailRewardProps> = ({
  reward,
  onSubmitReward,
  isCreateRewardModal = false,
  isLoading = false,
}) => {
  const [rewardPicture, setRewardPicture] = useState<null | File>(null);
  const [daysSelected, setDaysSelected] = useState<FiltrableOption[]>([]);
  const [updatePicture] = useUpdatePictureMutation();

  const REWARD_TYPE = [
    { id: RewardType.food, value: "Food" },
    { id: RewardType.market, value: "Market" },
    { id: RewardType.ticket, value: "Ticket" },
    { id: RewardType.selfCare, value: "Self Care" },
    { id: RewardType.shopping, value: "Shopping" },
    { id: RewardType.travel, value: "Travel" },
  ];
  const WEEK_DAYS = [
    { id: WeekDay.monday as unknown as string, name: "Lunes" },
    { id: WeekDay.tuesday as unknown as string, name: "Martes" },
    { id: WeekDay.wednesday as unknown as string, name: "Miércoles" },
    { id: WeekDay.thursday as unknown as string, name: "Jueves" },
    { id: WeekDay.friday as unknown as string, name: "Viernes" },
    { id: WeekDay.saturday as unknown as string, name: "Sábado" },
    { id: WeekDay.sunday as unknown as string, name: "Domingo" },
  ];

  const SCHEDULE = [
    { id: "00:00 AM", value: "00:00 AM" },
    { id: "01:00 AM", value: "01:00 AM" },
    { id: "02:00 AM", value: "02:00 AM" },
    { id: "03:00 AM", value: "03:00 AM" },
    { id: "04:00 AM", value: "04:00 AM" },
    { id: "05:00 AM", value: "05:00 AM" },
    { id: "06:00 AM", value: "06:00 AM" },
    { id: "07:00 AM", value: "07:00 AM" },
    { id: "08:00 AM", value: "08:00 AM" },
    { id: "09:00 AM", value: "09:00 AM" },
    { id: "10:00 AM", value: "10:00 AM" },
    { id: "11:00 AM", value: "11:00 AM" },
    { id: "12:00 PM", value: "12:00 PM" },
    { id: "01:00 AM", value: "01:00 AM" },
    { id: "02:00 AM", value: "02:00 AM" },
    { id: "03:00 AM", value: "03:00 AM" },
    { id: "04:00 PM", value: "04:00 PM" },
    { id: "05:00 PM", value: "05:00 PM" },
    { id: "06:00 PM", value: "06:00 PM" },
    { id: "07:00 PM", value: "07:00 PM" },
    { id: "08:00 PM", value: "08:00 PM" },
    { id: "09:00 PM", value: "09:00 PM" },
    { id: "10:00 PM", value: "10:00 PM" },
    { id: "11:00 PM", value: "11:00 PM" },
  ];

  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: reward?.title || "",
      subtitle: reward?.subtitle || "",
      description: reward?.description || "",
      type: reward?.type || RewardType.ticket,
      discount: reward?.discount || 0,
      picture: reward?.picture || "",
      expirationDate: reward?.expirationDate || undefined,
      schedule: reward?.schedule || undefined,
      code: reward?.code || "",
      provider: reward?.provider || undefined,
      countryId: reward?.countryId || "",
      isActive: true,
    },
  });

  const onSubmit = handleSubmit(async (data: Reward, event) => {
    event?.preventDefault();
    const scheduleData = {
      timeFrom: data.schedule?.timeFrom,
      timeTo: data.schedule?.timeTo,
      weekDays: daysSelected.map((day) => day.id as unknown as WeekDay),
    } as Schedule;
    onSubmitReward({
      reward: {
        ...data,
        schedule: scheduleData,
      },
      picture: rewardPicture,
    });
  });

  useEffect(() => {
    reset({
      ...reward,
    });
    if (reward?.schedule?.weekDays) {
      const daysSelectedData = reward.schedule.weekDays.map((day) => {
        return WEEK_DAYS.find((d) => d.id === day) || { name: day, id: day };
      });
      setDaysSelected(daysSelectedData);
    }
  }, [JSON.stringify(reward)]);

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

  const onSelectOption = (days: FiltrableOption[]) => {
    setDaysSelected(() => days);
  };
  const onRemoveDayClick = (id: string) => {
    if (daysSelected) {
      const daysSelectedUpdated = daysSelected.filter((day) => day.id != id);
      setDaysSelected(daysSelectedUpdated);
    }
  };
  const handleUploadPicture = async (file: File) => {
    if (!reward) return;
    const formData = new FormData();
    formData.append("picture", file);
    const fileData = await updatePicture({
      id: reward?.id,
      data: formData,
    }).unwrap();
    reset();
    return fileData;
  };
  const onSelectNewLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRewardPicture(file);
    handleUploadPicture(file);
  };

  return (
    <form onSubmit={onSubmit}>
      {COUNTRY_OPTIONS ? (
        <>
          <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-5 gap-y-6 gap-x-4">
            <Controller
              control={control}
              name="provider.name"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="providerName"
                  value={value ?? ""}
                  label="Provider"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-2  sm:col-start-1"
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
            <Controller
              control={control}
              name="code"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="code"
                  value={value ?? ""}
                  label="Code"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <div className="sm:col-span-2 sm:col-start-1">
              <SelectorMultioptions
                options={WEEK_DAYS}
                daysSelected={daysSelected}
                onRemoveClick={onRemoveDayClick}
                onSelectOption={onSelectOption}
                label="Choose available days"
                isDense={true}
              />
            </div>
            <Controller
              control={control}
              name="schedule.timeFrom"
              defaultValue="00:00"
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
                  id="timeFrom"
                  selectOptions={SCHEDULE}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="flex flex-col"
                  label="Available from: "
                />
              )}
            />
            <Controller
              control={control}
              name="schedule.timeTo"
              defaultValue="23:00"
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
                  id="timeTo"
                  selectOptions={SCHEDULE}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                  label="Available to: "
                />
              )}
            />
            <Controller
              control={control}
              name="expirationDate"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputDate
                  id="expirationDate"
                  value={value ?? ""}
                  label="Expiration Date"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassname="sm:col-span-1 "
                />
              )}
            />
            <Controller
              control={control}
              name="title"
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
                  id="title"
                  value={value ?? ""}
                  label="Title"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-3"
                />
              )}
            />
            <Controller
              control={control}
              name="type"
              defaultValue={RewardType.food}
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
                  selectOptions={REWARD_TYPE}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                  label="Rewards Type"
                />
              )}
            />
            <Controller
              control={control}
              name="discount"
              defaultValue={0}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputNumber
                  id="discount"
                  value={
                    (value as unknown as string) ?? (0 as unknown as string)
                  }
                  label="Discount (%)"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                  min={0}
                  max={100}
                  step="1"
                />
              )}
            />
            <Controller
              control={control}
              name="description"
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
                  id="description"
                  value={value ?? ""}
                  label="Description"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  rows={3}
                  containerClassName="sm:col-span-3"
                />
              )}
            />{" "}
            <div className="flex flex-row  sm:col-span-2 items-end space-x-3 pt-2">
              {rewardPicture || reward?.picture ? (
                <Image
                  src={
                    rewardPicture
                      ? URL.createObjectURL(rewardPicture)
                      : (reward?.picture as string)
                  }
                  unoptimized={true}
                  alt="rewardPicture"
                  width={64}
                  height={64}
                  objectFit="contain"
                  className="flex items-center justify-center flex-shrink-0 p-1"
                />
              ) : (
                <div className="flex items-center justify-center text-white h-16 w-16 text-2xl bg-gray-300 hover:bg-gray-400 flex-shrink-0 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <span className="uppercase">{""}</span>
                </div>
              )}
              <div className="flex flex-col items-end mt-4 whitespace-nowrap">
                <label className="group relative flex justify-center items-center px-4 h-10 text-base sm:text-sm font-medium rounded-md focus:outline-none border border-gray-300 text-gray-700 bg-white hover:bg-gray-100">
                  <span>Subir cover</span>
                  <input
                    id="picture"
                    name="picture"
                    type="file"
                    className="sr-only"
                    onChange={onSelectNewLogo}
                  />
                </label>
              </div>
            </div>
            <Controller
              control={control}
              name="isActive"
              defaultValue={true}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  id="isActive"
                  name="isActive"
                  label="Activar descuento"
                  value={value}
                  onChange={onChange}
                  containerClassName="sm:col-span-2 self-end pb-1"
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
                label={isCreateRewardModal ? "Create reward" : "Save changes"}
                type="submit"
                onClick={onSubmit}
              />
            )}
          </div>
        </>
      ) : (
        <LoadingBar />
      )}
    </form>
  );
};
export default DetailReward;
