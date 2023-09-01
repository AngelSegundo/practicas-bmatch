import Head from "next/head";
import Layout from "../../components/Layout";
import router from "next/router";
import {
  useDeleteCommunityByIdMutation,
  useGetCommunityByIdQuery,
  useUpdateCommunityMutation,
  useUpdateLogoMutation,
} from "../../store/services/community";
import Spinner from "ui/Spinner";
import DetailCommunity from "../../components/DetailCommunity";
import { Community, UserStatus } from "domain/entities";
import { useGetCountriesQuery } from "../../store/services/country";
import { useEffect, useMemo, useState } from "react";
import { Button, Tab } from "ui";
import UsersTable from "../../components/tables/UsersTable";
import { useLazyGetUsersByCommunityIdQuery } from "../../store/services/user";
import { useLazyGetSponsorByIdQuery } from "../../store/services/sponsor";

export default function CommunityIdPage() {
  const id = router.query.id as string;
  const { data: communityData, isLoading: isCommunityLoading } =
    useGetCommunityByIdQuery(id);

  const [updateCommunity] = useUpdateCommunityMutation();
  const [deleteCommunity] = useDeleteCommunityByIdMutation();
  const [updateLogo] = useUpdateLogoMutation();

  const communityUpdate = async (communityInfo: {
    community: Community;
    communityLogo: File | null;
  }) => {
    await updateCommunity({ id, data: communityInfo.community }).unwrap();
    if (communityInfo.communityLogo) {
      const formData = new FormData();
      formData.append("profilePicture", communityInfo.communityLogo);
      await updateLogo({
        id: id,
        data: formData,
      }).unwrap();
    }
  };

  const onChangeCommunityStatus = (newStatus: "active" | "inactive") => {
    if (!communityData) return;
    const {
      createdAt,
      id: _id,
      updatedAt,
      ...communityBaseData
    } = communityData;
    updateCommunity({ id, data: { ...communityBaseData, status: newStatus } });
  };

  const onDeleteCommunity = async () => {
    if (!communityData) return;
    if (window.confirm("¿Está seguro que desea borrar esta comunidad?")) {
      await deleteCommunity(id).unwrap();
      router.push("/communities");
    }
  };

  const [getSponsor, { data: sponsor }] = useLazyGetSponsorByIdQuery();

  const [getUsers, { data: users, isLoading: isUsersLoading }] =
    useLazyGetUsersByCommunityIdQuery();

  const [currentTab, setCurrentTab] = useState("Users" as string);
  useEffect(() => {
    if (isCommunityLoading) return;
    if (!isCommunityLoading && communityData) {
      getUsers(communityData.id);
      if (communityData.sponsorId) getSponsor(communityData.sponsorId);
    }
  }, [communityData, isCommunityLoading]);

  const [headCount, setHeadCount] = useState(0);

  useEffect(() => {
    if (isUsersLoading) return;
    if (!isUsersLoading && users) {
      const headCount = users.filter(
        (user) => user.status == UserStatus.active
      ).length;
      setHeadCount(headCount);
    }
  }, [users, isUsersLoading]);

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
  return (
    <div>
      {isCommunityLoading ? (
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading Community</h6>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-start justify-start bg-gray-50 w-full h-screen">
          <Head>
            <title>Bmatch - dev</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="w-full pt-4 flex flex-col flex-1">
            <div className="flex px-8 justify-between h-10">
              <div className="flex items-end w-full space-x-3">
                <h1 className="text-xl leading-8 font-semibold">
                  {communityData?.name}
                </h1>
                <div className="flex text-sm text-gray-500 leading-8 font-semibold space-x-2">
                  <div>
                    {communityData && countryOptions
                      ? countryOptions[communityData.countryId].code
                      : ""}
                  </div>
                  <div>
                    {" "}
                    {communityData && countryOptions
                      ? countryOptions[communityData.countryId].flagCode
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex px-8 justify-between">
              <h3 className=" h-10 text-sm text-gray-500 leading-8 font-semibold">
                The community has {headCount} members active
              </h3>
              <div className="flex gap-x-4">
                {communityData?.status == "active" ? (
                  <Button
                    label="Desactivar"
                    template="bmatch-secondary"
                    onClick={() => onChangeCommunityStatus("inactive")}
                  />
                ) : (
                  <Button
                    label="Activar"
                    template="bmatch-primary"
                    onClick={() => onChangeCommunityStatus("active")}
                  />
                )}
                <Button
                  label="Borrar"
                  template="danger"
                  onClick={onDeleteCommunity}
                />
              </div>
            </div>
            <div className="space-x-7 px-8 border-b border-gray-100">
              <Tab
                href={"#"}
                label="Users"
                selectTab={currentTab.toString()}
                onClick={() => setCurrentTab("Users")}
              />
              <Tab
                href={"#"}
                label="Community data"
                selectTab={currentTab.toString()}
                onClick={() => setCurrentTab("Community data")}
              />
            </div>
            {currentTab.toString() == "Community data" && (
              <div className="mt-2 space-x-7 border-b border-gray-100">
                <DetailCommunity
                  onSubmitCommunity={communityUpdate}
                  isLoading={isCommunityLoading}
                  community={communityData}
                />
              </div>
            )}
            {currentTab.toString() == "Users" && users && (
              <div>
                <UsersTable
                  data={users}
                  isLoading={isUsersLoading}
                  sponsor={sponsor}
                  community={communityData}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

CommunityIdPage.getLayout = (page: JSX.Element) => {
  return <Layout>{page}</Layout>;
};
