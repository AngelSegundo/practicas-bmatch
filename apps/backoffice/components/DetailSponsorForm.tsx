import { FunctionComponent, useEffect, useMemo } from "react";
import { Button, InputText, LoadingBar, Select } from "ui";
import { Controller, useForm } from "react-hook-form";
import { Sponsor } from "domain/entities";
import { useGetCountriesQuery } from "../store/services/country";
interface DetailSponsorFormProps {
  sponsor?: Sponsor;
  onModalClose?: () => void;
  onSubmitSponsor: (sponsor: Sponsor) => Promise<{ data: Sponsor } | void>;
  isCreateSponsorModal?: boolean;
  isLoading?: boolean;
}
const DetailSponsorForm: FunctionComponent<DetailSponsorFormProps> = ({
  sponsor,
  onModalClose,
  onSubmitSponsor,
  isCreateSponsorModal = false,
  isLoading = false,
}) => {
  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      legalName: sponsor?.legalName || "",
      commercialName: sponsor?.commercialName || "",
      taxId: sponsor?.taxId || "",
      countryId: sponsor?.countryId || "",
      billingAddress: {
        streetName: sponsor?.billingAddress?.streetName || "",
        location: sponsor?.billingAddress?.location || "",
        postalCode: sponsor?.billingAddress?.postalCode || "",
        countryId: sponsor?.billingAddress?.countryId || "",
        province: sponsor?.billingAddress?.province || "",
        city: sponsor?.billingAddress?.city || "",
      },
      manager: {
        firstName: sponsor?.manager?.firstName || "",
        lastName: sponsor?.manager?.lastName || "",
        email: sponsor?.manager?.email || "",
        phone: sponsor?.manager?.phone || "",
      },
    },
  });
  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    const sponsorData = {
      ...data,
    };
    if (isCreateSponsorModal) onModalClose?.();
    onSubmitSponsor(sponsorData);
  });

  useEffect(() => {
    reset({
      ...sponsor,
    });
  }, [JSON.stringify(sponsor)]);

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

  return (
    <form onSubmit={onSubmit}>
      {COUNTRY_OPTIONS ? (
        <>
          <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
            <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
              Sponsor data
            </h3>
            <Controller
              control={control}
              name="legalName"
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
                  id="legalName"
                  value={value ?? ""}
                  label="Legal Name"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-2"
                />
              )}
            />
            <Controller
              control={control}
              name="commercialName"
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
                  id="commercialName"
                  value={value ?? ""}
                  label="Commercial name"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-2"
                />
              )}
            />
            <Controller
              control={control}
              name="taxId"
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
                  id="taxId"
                  value={value ?? ""}
                  label="Tax ID"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-2"
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
            
            {/* Colocar Adjuntar PDF AQUI */}


          </div>
          <h6 className="mt-6 px-8 text-base text-gray-700">Address</h6>
          <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
            <Controller
              control={control}
              name="billingAddress.streetName"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="billingAddress.streetName"
                  value={value ?? ""}
                  label="Street"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-3"
                />
              )}
            />
            <Controller
              control={control}
              name="billingAddress.location"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="billingAddress.location"
                  value={value ?? ""}
                  label="Location"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="billingAddress.postalCode"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="billingAddress.postalCode"
                  value={value ?? ""}
                  label="Comuna"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="billingAddress.countryId"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="billingAddress.countryId"
                  value={value ?? ""}
                  label="Country ID"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="billingAddress.province"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="billingAddress.province"
                  value={value ?? ""}
                  label="State"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-3"
                />
              )}
            />
            <Controller
              control={control}
              name="billingAddress.city"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="billingAddress.city"
                  value={value ?? ""}
                  label="City"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
          </div>
          <h6 className="mt-6 px-8 text-base text-gray-700">Manager data</h6>
          <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
            <Controller
              control={control}
              name="manager.firstName"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="manager.firstName"
                  value={value ?? ""}
                  label="First Name"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-3"
                />
              )}
            />
            <Controller
              control={control}
              name="manager.lastName"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="manager.lastName"
                  value={value ?? ""}
                  label="Last Name"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="manager.email"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="manager.email"
                  value={value ?? ""}
                  label="Email"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
                />
              )}
            />
            <Controller
              control={control}
              name="manager.phone"
              defaultValue=""
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <InputText
                  id="manager.phone"
                  value={value ?? ""}
                  label="Phone Number"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  containerClassName="sm:col-span-1"
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
                label={isCreateSponsorModal ? "Create sponsor" : "Save changes"}
                type="submit"
                onClick={onSubmit}
              />
            )}
          </div>
        </>
      ) : (
        <div>pensando</div>
      )}
    </form>
  );
};
export default DetailSponsorForm;
