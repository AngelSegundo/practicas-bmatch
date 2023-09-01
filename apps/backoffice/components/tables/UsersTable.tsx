import { FunctionComponent, useMemo, useState } from "react";
import { Button, Chip, ChipProps, InputText, Table, CheckBox } from "ui";
import router from "next/router";
import Spinner from "ui/Spinner";
import {
  CommunityDTO,
  Invitation,
  SponsorDTO,
  UserDTO,
  UserStatus,
} from "domain/entities";
import { PlusIcon, UserAddIcon } from "@heroicons/react/solid";
import ModalCreateInvitation from "../ModalCreateInvitation";
import {
  useInvitationSaveMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
} from "../../store/services/user";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useGetCountriesQuery } from "../../store/services/country";
import { ModalDeleteWarning } from "../ModalDeleteWarning";

interface UsersTableProps {
  data: UserDTO[];
  isLoading?: boolean;
  sponsor?: SponsorDTO;
  community?: CommunityDTO;
  mainView?: boolean;
}

const UsersTable: FunctionComponent<UsersTableProps> = ({
  data,
  isLoading,
  sponsor,
  community,
  mainView = false,
}) => {
  const [filter, setFilter] = useState("");
  const columnHelper = createColumnHelper<UserDTO>();

  const [
    newInvitation,
    {
      isLoading: isNewInvitationSaveLoading,
      isSuccess: isNewInvitationSaveSuccess,
    },
  ] = useInvitationSaveMutation();
  const invitationSave = async (invitation: Invitation) => {
    newInvitation(invitation);
  };

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

  const typeStatus: { [key: string]: ChipProps } = {
    [UserStatus.pending]: {
      label: "Pendiente",
      template: "warning",
    },
    [UserStatus.active]: {
      label: "Activo",
      template: "success",
    },
    [UserStatus.inactive]: {
      label: "Cancelado",
      template: "error",
    },
  };

  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const handleCheckboxChange = (userId: string) => {
    setSelectedUser((currentState) => {
      if (currentState.includes(userId)) {
        return currentState.filter((userIdItem) => userIdItem !== userId);
      } else {
        return [...currentState, userId];
      }
    });
  };

  const [deleteSponsor, { isLoading: isLoadingDelete, isSuccess }] =
    useDeleteUserMutation();
  const [usersToDelete, setUsersToDelete] = useState<string[] | null>(null);

  const id = router.query.id as string;
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery({
    id: id,
    includeCommunities: false,
  });

  const columns = useMemo(() => {
    return [
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
      columnHelper.accessor((row) => `${row.name} ${row.surname}`, {
        id: "fullName",
        header: () => "Users",
        cell: (item) => (
          <div className="flex flex-row space-x-1">
            <CheckBox
              id={item.row.original.id}
              name={item.row.original.name}
              label=""
              value={selectedUser.includes(item.row.original.id)}
              onChange={() => handleCheckboxChange(item.row.original.id)}
              containerClassName="sm:col-span-2 self-end pb-1"
            />
            <Link href={`/users/${item.row.original.id}`}>
              <div className="flex flex-row items-center space-x-3">
                <p className="text-sm leading-5 font-medium text-gray-500 cursor-pointer w-fit">
                  {item.getValue()}
                </p>
              </div>
            </Link>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.email, {
        id: "email",
        header: () => "Email",
        cell: (item) => (
          <p className="text-sm leading-5 font-medium text-gray-500 w-fit">
            {item.getValue()}
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
      columnHelper.accessor((row) => row.id, {
        id: "view",
        header: () => "",
        cell: (item) => (
          <Link href={`/users/${item.row.original.id}`}>
            <p className="text-sm leading-5 font-medium text-blue-600 cursor-pointer w-fit">
              View
            </p>
          </Link>
        ),
      }),
    ];
  }, [
    isCountryOptionsLoading,
    JSON.stringify(countries),
    JSON.stringify(selectedUser),
    JSON.stringify(data),
  ]);

  const [openModalCreateInvitation, setOpenModalCreateInvitation] =
    useState<boolean>(false);

  return (
    <div className="w-full px-8 pt-4 flex flex-col flex-1">
      <div className="items-center flex justify-between ">
        {mainView ? (
          <h1 className="text-2xl leading-8 font-semibold">Users</h1>
        ) : (
          <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
            Users ({data.length})
          </h3>
        )}
        <div className="mt-6 flex flex-row self-end w-fit text-right sm:flex-row xl:justify-end xl:mt-0 md:flex-row">
          <div className="flex flex-row items-center gap-x-4 whitespace-nowrap">
            <InputText
              id="searchCompany"
              placeholder="Search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              containerClassName="border-gray-300 pr-4"
              inputClassName="!mt-0 sm:w-48 w-20"
            />
            <Button
              type="button"
              template="bmatch-primary"
              label="Invite users"
              icon={<PlusIcon className="h-4 w-4 mr-2" />}
              onClick={() => setOpenModalCreateInvitation(true)}
              customClassName="whitespace-nowrap"
            />
            {selectedUser.length !== 0 && (
              <Button
                label="Borrar Usuarios Seleccionados"
                template="danger"
                onClick={() => {
                  setUsersToDelete(selectedUser);
                }}
              />
            )}
            {selectedUser.length === 0 && (
              <Button
                label="Borrar Usuarios Seleccionados"
                disabled={true}
                template="danger"
                onClick={() => {}}
              />
            )}
          </div>
        </div>
      </div>
      <ModalCreateInvitation
        onClickCreateInvitation={() => setOpenModalCreateInvitation(false)}
        openModalCreateInvitation={openModalCreateInvitation}
        onSubmitCreateInvitation={invitationSave}
        isNewInvitationSaveLoading={isNewInvitationSaveLoading}
        isNewInvitationSaveSuccess={isNewInvitationSaveSuccess}
        sponsor={sponsor || undefined}
        community={community || undefined}
      />
      {isLoading ? (
        <div className="w-all flex-1 items-center justify-center flex">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Cargando users</h6>
          </div>
        </div>
      ) : (
        <div className="w-all flex-1">
          {data.length <= 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 space-y-3">
              <UserAddIcon className="text-gray-500 h-12 w-12" />
              <p className="text-base text-center leading-7 font-normal text-gray-500">
                No users yet
              </p>
              <Button
                type="button"
                template="bmatch-primary"
                label="Invite users"
                icon={<PlusIcon className="h-4 w-4 mr-2" />}
                onClick={() => setOpenModalCreateInvitation(true)}
                customClassName="whitespace-nowrap"
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
      )}

      {usersToDelete !== null && (
        <ModalDeleteWarning
          title={"Borrar Usuarios Seleccionados"}
          isOpen={usersToDelete !== null}
          onCancel={() => setUsersToDelete(null)}
          onAccept={async () => {
            await Promise.all(
              usersToDelete.map((userId) => {
                if (userId) {
                  deleteSponsor(userId).unwrap();
                }
              })
            );
            setUsersToDelete(null);
            setSelectedUser([]);
          }}
          cancelActionLabel={"Cancelar"}
          closeActionLabel={"Borrar"}
        >
          <p className="text-sm leading-5 font-normal text-gray-500">
            ¿Estás seguro que quieres eliminar {usersToDelete.length} usuarios?
          </p>
        </ModalDeleteWarning>
      )}
    </div>
  );
};

export default UsersTable;
