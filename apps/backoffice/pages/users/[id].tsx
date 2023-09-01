import Head from "next/head";
import { Button, Chip, ChipProps, Tab } from "ui";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import router from "next/router";
import { useLazyGetSponsorByIdQuery } from "../../store/services/sponsor";
import Spinner from "ui/Spinner";
import DetailSponsor from "../../components/DetailSponsor";
import { useDeleteUserMutation, useGetUserByIdQuery } from "../../store/services/user";
import DetailUser from "../../components/DetailUser";
import ServiceConnectionsTable from "../../components/tables/ServiceConnectionsTable";
import { useLazyGetServiceConnectionsByUserIdQuery } from "../../store/services/service-connections";
import { UserStatus } from "domain/entities";
import { useGetCountriesQuery } from "../../store/services/country";
import Link from "next/link";
import { deleteUser } from "firebase/auth";

export default function UserIdPage() {
  const [currentTab, setCurrentTab] = useState("User data" as string);
  const id = router.query.id as string;
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery({
    id: id,
    includeCommunities: true,
  });
  const [
    getServiceConnections,
    { data: serviceConnections, isLoading: isServiceConnectionsLoading },
  ] = useLazyGetServiceConnectionsByUserIdQuery();

  const [getSponsor, { data: sponsorData }] = useLazyGetSponsorByIdQuery();
  const [deleteSponser] = useDeleteUserMutation();

  useEffect(() => {
    if (isUserLoading) return;
    if (!isUserLoading && user) {
      getSponsor(user.sponsorId);
      getServiceConnections(id);
    }
  }, [isUserLoading, user]);

  useEffect(() => {
    if (isServiceConnectionsLoading) return;
    if (!isServiceConnectionsLoading && serviceConnections) {
      console.log("servicesReg");
    }
  }, [serviceConnections, isServiceConnectionsLoading]);

  const typeStatus: { [key: string]: ChipProps } = {
    [UserStatus.pending]: {
      label: "Pending",
      template: "warning",
    },
    [UserStatus.active]: {
      label: "Active",
      template: "green50",
    },
    [UserStatus.inactive]: {
      label: "Inactive",
      template: "dark",
    },
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

  const onDeleteUser = async () => {
    if (window.confirm("¿Está seguro de que desea borrar el usuario?")) {
      deleteSponser(id).unwrap().then(() => {
        router.push("/users");
      });
    }
  }

  return (
    <div>
      {!isUserLoading && user ? (
        <div className="flex flex-1 flex-col items-start justify-start bg-gray-50 w-full h-screen">
          <Head>
            <title>Bmatch - dev</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className="w-full pt-4 flex flex-col flex-1">
            <div className="my-4 px-8 flex flex-col gap-x-4  space-x-3 ">
              <div className="items-center flex justify-start">
                <div className="flex flex-row space-x-3 items-center justify-start w-full">
                  <div className="flex flex-row grow  items-center text-xl leading-8 font-semibold space-x-3">
                    <div className="flex flex-row space-x-1">
                      <h1>{user?.name}</h1>
                      <h1>{user?.surname}</h1>
                    </div>
                    {sponsorData?.id && (
                      <Link href={`/sponsors/${sponsorData?.id}`}>
                        <div className="flex flex-nowrap justify-start text-sm text-gray-500 hover:text-gray-700 leading-8 font-semibold">
                          {sponsorData?.commercialName}
                        </div>
                      </Link>
                    )}
                    <div className="text-sm text-gray-500 leading-8 font-semibold">
                      <div className="flex text-sm text-gray-500 leading-8 font-semibold space-x-2">
                        <div>
                          {sponsorData && countryOptions
                            ? countryOptions[sponsorData.countryId].code
                            : ""}
                        </div>
                        <div>
                          {" "}
                          {sponsorData && countryOptions
                            ? countryOptions[sponsorData.countryId].flagCode
                            : ""}
                        </div>
                      </div>
                    </div>
                    <Chip
                      label={typeStatus[user.status].label}
                      template={typeStatus[user.status].template}
                      isSquare={true}
                    />
                  </div>
                  <Button label="Borrar" template="danger" onClick={onDeleteUser} />
                </div>
              </div>
            </div>
            <div className="space-x-7 px-8 border-b border-gray-100">
              <Tab
                href={"#"}
                label="Services"
                selectTab={currentTab.toString()}
                onClick={() => setCurrentTab("Services")}
              />
              <Tab
                href={"#"}
                label="User data"
                selectTab={currentTab.toString()}
                onClick={() => setCurrentTab("User data")}
              />
            </div>
            {currentTab.toString() == "User data" && (
              <DetailUser user={user} sponsor={sponsorData} />
            )}
            {currentTab.toString() == "Rewards" && (
              <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
                <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
                  Rewards
                </h3>
              </div>
            )}
            {currentTab.toString() == "Services" &&
              serviceConnections &&
              user && (
                <ServiceConnectionsTable
                  data={serviceConnections}
                  countryId={user.countryId}
                />
              )}
            {currentTab.toString() == "Sponsor data" && (
              <DetailSponsor sponsor={sponsorData} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">User Loading</h6>
          </div>
        </div>
      )}
    </div>
  );
}

UserIdPage.getLayout = (page: JSX.Element) => {
  return <Layout>{page}</Layout>;
};
