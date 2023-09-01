import { InvitationForm } from "domain/entities";
import { FunctionComponent } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputText } from "ui";

interface FormCreateInvitationProps {
  addInvitation: (invitation: InvitationForm) => void;
  taxLabel: string;
  checkSponsor: boolean;
}

const FormCreateInvitation: FunctionComponent<FormCreateInvitationProps> = ({
  addInvitation,
  taxLabel,
  checkSponsor,
}) => {
  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      taxId: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const invitationData = {
      ...data,
    };
    addInvitation(invitationData);
    reset();
  });
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-between space-y-2"
    >
      <label
        htmlFor={"label"}
        className="block text-base sm:text-m font-medium text-gray-800"
      >
        Enter user data
      </label>

      <div className="grid grid-row mb-3 sm:grid-cols-4 space-x-2">
        <Controller
          control={control}
          name="name"
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
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="sm:col-span-1"
              label="Name"
            />
          )}
        />
        <Controller
          control={control}
          name="surname"
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
              id="surname"
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="sm:col-span-1"
              label="Surnames"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
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
              id="email"
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="sm:col-span-1"
              label="Email"
            />
          )}
        />
        <Controller
          control={control}
          name="taxId"
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
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="sm:col-span-1"
              label={taxLabel}
            />
          )}
        />
      </div>
      <div className="flex flex-row justify-end">
        <Button
          template="bmatch-secondary"
          customClassName="mt-5 w-fit whitespace-nowrap"
          label={"Add User"}
          type="submit"
          onClick={onSubmit}
          disabled={!checkSponsor}
        />
      </div>
    </form>
  );
};

export default FormCreateInvitation;
