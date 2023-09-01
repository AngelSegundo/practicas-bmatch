import { FunctionComponent, useMemo } from "react";
import { SponsorDTO, UserDTO } from "domain/entities";
import { Button, InputText, UserAvatar } from "ui";
import { useUpdateUserMutation } from "../store/services/user";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../store/root";
import { showAlert } from "../store/slices/notifications";
import CommunitiesTable from "./tables/CommunitiesTable";
import { useGetCountriesQuery } from "../store/services/country";
import Image from "next/image";

interface DetailUserProps {
  user?: UserDTO;
  sponsor?: SponsorDTO;
}

const DetailUser: FunctionComponent<DetailUserProps> = ({ user, sponsor }) => {
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const { handleSubmit, control } = useForm({
    mode: "onChange",
    defaultValues: {
      email: user?.email || "",
      phone: user?.phone || "",
      name: user?.name || "",
      surname: user?.surname || "",
      taxId: user?.taxId || "",
      countryId: user?.countryId || "",
    },
  });

  const { data: countries = [], isLoading: isCountryOptionsLoading } =
    useGetCountriesQuery();
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

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    const userData = {
      ...data,
    };
    if (user?.id) {
      try {
        updateUser({ id: user?.id, user: userData });
      } catch (error: unknown) {
        const errorCode = error;
        console.log(errorCode);
        dispatch(
          showAlert({
            template: "error",
            text: "Error: Something is wrong",
          })
        );
      }
      dispatch(
        showAlert({
          template: "success",
          text: "User has been updating successfully",
        })
      );
    }
  });

  return (
    <div className="px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
      <div className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
        {user && countryOptions && (
          <div className="w-full flex flex-col flex-1">
            <>
              <div className="mt-8 bg-white shadow overflow-hidden rounded-lg p-5">
                <div className="flex h-all col-span-4 items-center space-x-3">
                  <div className="flex flex-row text-l items-center leading-5 font-semibold text-gray-900 w-all h-8  space-x-1">
                    User data
                  </div>
                </div>
                <div className="flex flex-row w-auto space-x-3 pt-2">
                  <div className="pt-2 px-4">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture as string}
                        unoptimized={true}
                        alt="profile picture"
                        width={72}
                        height={72}
                        objectFit="cover"
                        className="flex items-center justify-center flex-shrink-0 rounded-full p-1"
                      />
                    ) : (
                      <div>
                        <UserAvatar
                          name={user?.name}
                          surname={user?.surname}
                          size="l"
                        />
                      </div>
                    )}
                  </div>
                  <form
                    onSubmit={onSubmit}
                    className="w-full bg-white rounded-md"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-8 gap-4">
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
                            containerClassName="sm:col-span-4"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="surname"
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
                            id="surname"
                            value={value ?? ""}
                            label="Surname"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-4"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="countryId"
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
                            id="countryId"
                            value={countryOptions[value].name ?? ""}
                            label="Country"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-4"
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
                            label="RUT"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-4"
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="email"
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
                            id="email"
                            value={value ?? ""}
                            label="Email"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-4"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="phone"
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
                            id="phone"
                            value={value ?? ""}
                            label="Phone Number"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={error?.message}
                            containerClassName="sm:col-span-4"
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col items-end mt-4 py-3">
                      <Button
                        template="bmatch-primary"
                        customClassName="w-fit"
                        label="Guardar"
                        type="submit"
                        onClick={() => {}}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="mt-8 bg-white shadow overflow-hidden rounded-lg p-5">
                {user.communitiesData &&
                  user.communitiesData.length >= 0 &&
                  sponsor && (
                    <>
                      <div className="flex h-all col-span-4 items-center space-x-3 pb-4 border-b">
                        <h3 className="text-l leading-5 font-semibold text-gray-900 w-all h-8 flex items-center">
                          Communities
                        </h3>
                      </div>
                      <CommunitiesTable
                        data={user.communitiesData}
                        isVisibleHead={false}
                        sponsor={sponsor}
                      />
                    </>
                  )}
              </div>
            </>
          </div>
        )}
      </div>
    </div>
  );
};
export default DetailUser;
