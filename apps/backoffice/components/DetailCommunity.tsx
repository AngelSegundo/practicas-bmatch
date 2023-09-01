import { FunctionComponent, useMemo, useState } from "react";
import {
  Button,
  InputText,
  InputTextArea,
  LoadingBar,
  RadioButton,
  Select,
} from "ui";
import { Controller, useForm } from "react-hook-form";
import { Community, CommunityDTO, SponsorDTO } from "domain/entities";
import { useUpdateLogoMutation } from "../store/services/community";
import Image from "next/image";

interface DetailCommunityProps {
  community?: CommunityDTO;
  sponsor?: SponsorDTO;
  sponsors?: SponsorDTO[];
  mainView?: boolean;
  onModalClose?: () => void;
  onSubmitCommunity: (communityInfo: {
    community: Community;
    communityLogo: File | null;
  }) => Promise<{ data: CommunityDTO; communityLogo: File | null } | void>;
  isCreateCommunityModal?: boolean;
  isLoading?: boolean;
}

interface CommunityData
  extends Omit<Community, "isPublic" | "isVisible" | "isCorporate"> {
  isPublic?: string;
}

const DetailCommunity: FunctionComponent<DetailCommunityProps> = ({
  community,
  onModalClose,
  onSubmitCommunity,
  isCreateCommunityModal = false,
  isLoading = false,
  sponsor,
  sponsors,
  mainView = false,
}) => {
  const [updateLogo] = useUpdateLogoMutation();

  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      name: community?.name || "",
      description: community?.description || "",
      countryId: community?.countryId || sponsor?.countryId || "",
      sponsorId: community?.sponsorId || sponsor?.id || "",
      sponsorName: community?.sponsorName || sponsor?.commercialName || "",
      isSponsorDefault: false,
      profilePicture: community?.profilePicture || "",
      isPublic: community?.isPublic.toString(),
      accessCode: community?.accessCode || "",
      status: community?.status || "active",
    },
  });

  const [communityLogo, setCommunityLogo] = useState<null | File>(null);

  const handleUploadLogo = async (file: File) => {
    if (!community) return;
    const formData = new FormData();
    formData.append("profilePicture", file);
    const fileData = await updateLogo({
      id: community?.id,
      data: formData,
    }).unwrap();
    reset();
    return fileData;
  };

  const onSelectNewLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCommunityLogo(file);
    handleUploadLogo(file);
  };

  const onSubmit = handleSubmit(async (data: CommunityData, event) => {
    event?.preventDefault();

    if (mainView && data.sponsorId) {
      const sponsorData = sponsors?.find(
        (sponsor) => sponsor.id === data.sponsorId
      );
      if (sponsorData) {
        const communityData = {
          ...data,
          countryId: sponsorData.countryId,
          sponsorName: sponsorData.commercialName,
          sponsorId: sponsorData.id,
          founderId: sponsorData.id,
          isPublic: data.isPublic === "true",
          isVisible: data.isPublic === "true",
          isCorporate: true,
        };
        onSubmitCommunity({
          community: communityData,
          communityLogo: communityLogo,
        });
      }
    } else {
      const communityData = {
        ...data,
        isPublic: data.isPublic === "true",
        isVisible: data.isPublic === "true",
        isCorporate: true,
      };
      onSubmitCommunity({
        community: communityData,
        communityLogo: communityLogo,
      });
    }

    if (isCreateCommunityModal) onModalClose?.();
  });

  const SPONSORS_OPTIONS = useMemo(() => {
    if (!mainView) return;
    if (mainView && sponsors) {
      const data = sponsors.map((sponsor) => {
        return {
          value: sponsor.commercialName,
          id: sponsor.id,
        };
      });
      return data;
    }
  }, [sponsors, mainView]);

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
        <h3 className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
          Community data
        </h3>
        {mainView && SPONSORS_OPTIONS && (
          <Controller
            control={control}
            name="sponsorId"
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
                id="sponsorId"
                selectOptions={SPONSORS_OPTIONS}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                containerClassName="sm:col-span-6"
                label="Sponsor"
              />
            )}
          />
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
              containerClassName="sm:col-span-3"
            />
          )}
        />
        <div className="h-all col-span-3 pl-10">
          <p className="block text-base sm:text-sm font-medium text-gray-700">
            Logo de la comunidad
          </p>
          <div className="flex items-end w-auto space-x-3 pt-2">
            {communityLogo || community?.profilePicture ? (
              <Image
                src={
                  communityLogo
                    ? URL.createObjectURL(communityLogo)
                    : (community?.profilePicture as string)
                }
                unoptimized={true}
                alt="logo de compañia"
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
              rows={5}
              containerClassName="sm:col-span-6"
            />
          )}
        />
        <div className="col-span-4">
          <Controller
            control={control}
            name="isPublic"
            defaultValue={"false"}
            render={({ field: { onChange, value } }) => (
              <RadioButton
                id="isPublic"
                name="isPublic"
                value={value ? value : "false"}
                labelTrue="Public Community. Anyone can join"
                labelFalse="Private Community. Users will only be able to join through an invitation"
                onChange={onChange}
                defaultValue={"false"}
              />
            )}
          />
        </div>
        {community && community?.accessCode && !community.isPublic && (
          <InputText
            id="accessCode"
            value={community?.accessCode}
            label="Access code"
            containerClassName="sm:col-span-2 sm:col-start-1"
            disabled={true}
          />
        )}
      </div>
      <div className="border-b p-4 mx-6"></div>
      <div className="flex flex-col items-end mt-4 py-3 px-8">
        {isLoading ? (
          <LoadingBar />
        ) : (
          <div className="flex flex-row space-x-4">
            {!isCreateCommunityModal && (
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
                isCreateCommunityModal ? "Create community" : "Save changes"
              }
              type="submit"
              onClick={onSubmit}
            />
          </div>
        )}
      </div>
    </form>
  );
};
export default DetailCommunity;
