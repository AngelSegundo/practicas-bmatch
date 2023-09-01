import { XIcon } from "@heroicons/react/solid";
import {
  Invitation,
  SponsorDTO,
  InvitationForm,
  CommunityDTO,
} from "domain/entities";
import papa from "papaparse";
import {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Modal, Select } from "ui";
import BulletsStep, { BaseSteps, Status } from "ui/BulletsStep";
import { useAppDispatch } from "../store/root";
import { useLazyGetCommunitiesOfSponsorAndPublicsQuery } from "../store/services/community";
import { useLazyGetCountryByIdQuery } from "../store/services/country";
import {
  useLazyGetAllSponsorsQuery,
  useLazyGetSponsorByIdQuery,
} from "../store/services/sponsor";
import { useManyInvitationsSaveMutation } from "../store/services/user";
import { showAlert } from "../store/slices/notifications";
import FormCreateInvitation from "./FormCreateInvitation";
import InvitationFormTable from "./tables/InvitationFormTable";
import { FiltrableOption } from "ui/SelectCombo";
import SelectorCommunities from "./SelectorCommunities";

interface ModalCreateInvitationProps {
  openModalCreateInvitation: boolean;
  onClickCreateInvitation: () => void;
  listDomains?: string[] | undefined;
  onSubmitCreateInvitation: (
    invitation: Invitation
  ) => Promise<{ data: Invitation } | void>;
  isNewInvitationSaveLoading?: boolean;
  isNewInvitationSaveSuccess?: boolean;
  isNewInvitationSaveUninitialized?: boolean;
  sponsor?: SponsorDTO;
  community?: CommunityDTO;
}
const ModalCreateInvitation: FunctionComponent<ModalCreateInvitationProps> = ({
  openModalCreateInvitation,
  onClickCreateInvitation,
  sponsor,
  community,
}) => {
  const dispatch = useAppDispatch();
  const [saveManyInvitations] = useManyInvitationsSaveMutation();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [disabledCommunities, setDisabledCommunities] =
    useState<FiltrableOption[]>();
  const [taxLabel, setTaxCountryLabel] = useState("TaxID");

  const [communitiesSelected, setCommunitiesSelected] = useState<
    FiltrableOption[]
  >(
    community && !community.isSponsorDefault
      ? [{ id: community.id, name: community.name }]
      : []
  );
  const [steps, setSteps] = useState<BaseSteps | []>([]);
  const [addEmailState, setAddEmailState] = useState<Status>("current");
  const [chooseCommunityState, setChooseCommunityState] =
    useState<Status>("upcoming");
  const [confirmState, setConfirmState] = useState<Status>("upcoming");
  const [resumeState, setResumeState] = useState<Status>("upcoming");

  const addSteps = [
    {
      number: "01",
      name: "Add email",
      status: addEmailState,
    },
    {
      number: "02",
      name: "Choose Community",
      status: chooseCommunityState,
    },
    {
      number: "03",
      name: "Send Invites",
      status: confirmState,
    },
  ];

  const { handleSubmit, control, reset, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      sponsorId: "",
      communitiesSelected: [],
    },
  });

  const [getSponsors, { data: sponsors, isLoading: isSponsorsLoading }] =
    useLazyGetAllSponsorsQuery();
  const [getSponsor, { data: sponsorData, isLoading: isSponsorLoading }] =
    useLazyGetSponsorByIdQuery();
  const [getCountry, { data: countryData, isLoading: isCountryLoading }] =
    useLazyGetCountryByIdQuery();
  const [
    getCommunitiesBySponsorAndPublics,
    { data: communities, isLoading: isCommunitiesLoading },
  ] = useLazyGetCommunitiesOfSponsorAndPublicsQuery();

  const SPONSORS_OPTIONS = useMemo(() => {
    if (isSponsorsLoading) return;
    if (!isSponsorsLoading && sponsors) {
      const sponsors_options = sponsors.map((sponsor) => {
        return {
          value: sponsor.commercialName,
          id: sponsor.id,
        };
      });
      return sponsors_options;
    }
  }, [sponsors, isSponsorsLoading]);
  const [currentSponsorId, setCurrentSponsorId] = useState<string>();
  const [checkSponsor, setCheckSponsor] = useState(false);
  const [hasImportedFile, setHasImportedFile] = useState(false);
  const onCheckSponsor = handleSubmit(async (data) => {
    setCurrentSponsorId(data?.sponsorId);
    setCheckSponsor(true);
  });

  useEffect(() => {
    setCommunitiesSelected(() => []);
    if (sponsor) {
      getCommunitiesBySponsorAndPublics(sponsor.id);
    }
    if (currentSponsorId) {
      getSponsor(currentSponsorId);
      getCommunitiesBySponsorAndPublics(currentSponsorId);
    }
  }, [currentSponsorId]);

  useEffect(() => {
    if (isSponsorLoading || sponsor) return;
    if (!isSponsorLoading && sponsorData) getCountry(sponsorData.countryId);
  }, [isSponsorLoading, sponsorData]);

  const COMMUNITIES_OPTIONS: FiltrableOption[] | undefined = useMemo(() => {
    const currentSponsor = sponsor ? sponsor : sponsorData;
    if (isCommunitiesLoading) return;
    if (!isCommunitiesLoading && communities) {
      const sponsorDefaultCommunity = communities.find(
        (com) =>
          com.isSponsorDefault === true &&
          currentSponsor?.id === com.sponsorId &&
          !communitiesSelected?.some((item) => com.id === item.id)
      );

      if (sponsorDefaultCommunity) {
        setCommunitiesSelected((communitiesSelected) => [
          ...communitiesSelected,
          {
            id: sponsorDefaultCommunity.id,
            name: sponsorDefaultCommunity.name,
          },
        ]);
        setDisabledCommunities([
          {
            id: sponsorDefaultCommunity?.id,
            name: sponsorDefaultCommunity?.name,
          },
        ]);
      }
      const communities_options = communities.map((community) => {
        return {
          name: community.name,
          id: community.id,
        };
      });
      return communities_options;
    }
  }, [isCommunitiesLoading, communities]);

  useEffect(() => {
    if (sponsor) {
      getCountry(sponsor.countryId);
      getCommunitiesBySponsorAndPublics(sponsor.id);
      setCheckSponsor(true);
    }
    if (!sponsor && !sponsors) {
      getSponsors();
    } else return;
  }, [sponsor]);

  useEffect(() => {
    if (community && community.isSponsorDefault === false) {
      setCommunitiesSelected(() => [
        { id: community.id, name: community.name },
      ]);
    }
  }, [community]);

  useEffect(() => {
    if (isCountryLoading) return;
    if (!isCountryLoading && countryData) {
      setTaxCountryLabel(() => {
        return countryData.taxIdLabel;
      });
    }
  }, [isCountryLoading, countryData]);

  const onSelectOption = (communities: FiltrableOption[]) => {
    setCommunitiesSelected(() => communities);
  };
  const onRemoveCommunityClick = (id: string) => {
    if (disabledCommunities?.some((com) => com.id === id)) {
      dispatch(
        showAlert({
          template: "error",
          text: "You can't delete this community",
        })
      );
      return;
    }
    const communitiesSelectedUpdated = communitiesSelected.filter(
      (com) => com.id != id
    );
    setCommunitiesSelected(communitiesSelectedUpdated);
  };

  const addInvitation = (invitationData: InvitationForm) => {
    const foundTaxId = invitations.find(
      (invitation) => invitation.taxId === invitationData.taxId
    );
    if (foundTaxId) {
      dispatch(
        showAlert({
          template: "error",
          text: "This Tax ID is already on the list",
        })
      );
    } else {
      const invitation = {
        name: invitationData.name,
        surname: invitationData.surname,
        email: invitationData.email,
        taxId: invitationData.taxId,
        sponsorId: "",
        sponsorName: "",
        communityIds: [],
        countryId: "",
        isConsumed: false,
      };
      setInvitations((currentInvitations) => [
        ...currentInvitations,
        invitation,
      ]);
    }
  };

  const removeInvitation = (taxId: string) => {
    setInvitations((currentInvitations) =>
      currentInvitations.filter((element) => element.taxId !== taxId)
    );
  };

  const onSubmit = async () => {
    const invitationsData = invitations.map((inv) => {
      return {
        name: inv.name,
        surname: inv.surname,
        email: inv.email,
        taxId: inv.taxId,
        sponsorId: currentSponsorId || sponsor?.id || "",
        sponsorName:
          sponsor?.commercialName || sponsorData?.commercialName || "",
        communityIds: communitiesSelected.map((com) => com.id),
        countryId: sponsor?.countryId || countryData?.id || "",
        isConsumed: false,
      };
    });
    try {
      await saveManyInvitations(invitationsData);
    } catch (error: unknown) {
      dispatch(
        showAlert({
          template: "error",
          text: "Error: Something is wrong",
        })
      );
    }
    setConfirmState("complete");
    setResumeState("current");
    dispatch(
      showAlert({
        template: "success",
        text: "Invitations have been sent successfully",
      })
    );
  };

  const resetModal = () => {
    reset();
    setAddEmailState("current");
    setChooseCommunityState("upcoming");
    setConfirmState("upcoming");
    setResumeState("upcoming");
    setInvitations([]);
    setValue("sponsorId", "");
    setCommunitiesSelected(() => []);
    setCheckSponsor(sponsor !== undefined);
    setCurrentSponsorId(undefined);
  };

  useEffect(() => {
    setSteps(addSteps);
  }, [addEmailState, chooseCommunityState, confirmState]);

  const onImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files) return;
    interface FileInvitation {
      Name: string;
      Surname: string;
      Email: string;
      TaxID: string;
    }
    papa.parse<FileInvitation>(event.target.files[0], {
      header: true,
      skipEmptyLines: true,

      complete: function (results) {
        const invitations = results.data
          .filter((invitation: FileInvitation) => {
            return (
              invitation.Name &&
              invitation.Surname &&
              invitation.Email &&
              invitation.TaxID
            );
          })
          .map((inv: FileInvitation) => {
            return {
              name: inv.Name,
              surname: inv.Surname,
              email: inv.Email,
              taxId: inv.TaxID,
              sponsorId: currentSponsorId || sponsor?.id || "",
              sponsorName:
                sponsor?.commercialName || sponsorData?.commercialName || "",
              communityIds: communitiesSelected.map((com) => com.id),
              countryId: sponsor?.countryId || countryData?.id || "",
              isConsumed: false,
            };
          });
        setInvitations((currentInvitations) => [
          ...currentInvitations,
          ...invitations,
        ]);
        setHasImportedFile(true);
      },
    });
  };

  return (
    <Modal
      isOpen={openModalCreateInvitation}
      onClose={() => {
        onClickCreateInvitation(), resetModal();
      }}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md h-3/6	max-h-full min-h-max">
        <div className="flex flex-col mt-4 m-6">
          <div className="flex flex-row justify-between pb-2">
            <p className="text-2xl leading-8 font-semibold">Invite User</p>
            <XIcon
              className="h-6 w-6 text-gray-400"
              aria-hidden="true"
              role="button"
              onClick={() => {
                onClickCreateInvitation();
                resetModal();
              }}
            />
          </div>
          <div className="flex flex-row space-x-1 text-sm leading-5">
            <p className="font-normal text-gray-500">
              Add up to 5 users{sponsor ? " to " : "."}
            </p>
            {sponsor && (
              <>
                <p className="font-bold text-gray-900">
                  {sponsor?.commercialName}
                </p>
                <p className="font-normal text-gray-500">sponsor.</p>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col pl-6 pr-8">
          <form>
            <div className="grid grid-row my-3 sm:grid-cols-6 space-x-2">
              {sponsor === undefined &&
                addEmailState === "current" &&
                SPONSORS_OPTIONS && (
                  <>
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
                  </>
                )}
            </div>
            <div className="flex flex-row justify-end">
              {!sponsor && addEmailState === "current" && (
                <Button
                  template="bmatch-secondary"
                  customClassName="mt-5 w-fit whitespace-nowrap"
                  label={"Check sponsor"}
                  type="submit"
                  onClick={onCheckSponsor}
                />
              )}
            </div>
          </form>
        </div>
        <div className="flex flex-row justify-between">
          <BulletsStep steps={steps} onClick={null} />
          {addEmailState === "current" && (
            <>
              <div className="flex flex-grow flex-col py-4 px-8">
                <label className="group self-end relative flex justify-center items-center px-4 h-10 w-36 text-base sm:text-sm font-medium rounded-md focus:outline-none border border-gray-300 text-gray-700 bg-white hover:bg-gray-100">
                  <span>Importar fichero</span>
                  <input
                    id="usersListFile"
                    name="usersListFile"
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={onImportFile}
                    multiple={false}
                  />
                </label>
                <div>
                  {!hasImportedFile && (
                    <FormCreateInvitation
                      addInvitation={addInvitation}
                      taxLabel={taxLabel}
                      checkSponsor={checkSponsor}
                    />
                  )}
                  <InvitationFormTable
                    invitations={invitations}
                    onRemoveInvitationClick={removeInvitation}
                    taxIdLabel={taxLabel}
                  />
                </div>
              </div>
            </>
          )}
          {chooseCommunityState === "current" && COMMUNITIES_OPTIONS && (
            <SelectorCommunities
              options={COMMUNITIES_OPTIONS}
              communitiesSelected={communitiesSelected}
              onRemoveClick={onRemoveCommunityClick}
              onSelectOption={onSelectOption}
              disabledCommunities={disabledCommunities}
            />
          )}
          {(confirmState === "current" || resumeState === "current") && (
            <div className="flex flex-col justify-center py-4 px-16 w-full overflow-hidden bg-white ">
              <div className="py-2 px-2">
                <h3 className="text-sm font-medium leading-6 text-gray-900">
                  You are about to send
                </h3>
              </div>
              <dl>
                <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Invitations number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {invitations.length}
                  </dd>
                </div>
                <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Sponsor</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {sponsor
                      ? sponsor.commercialName
                      : sponsorData?.commercialName}
                  </dd>
                </div>
                <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Communities
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul>
                      {communitiesSelected.map((community) => (
                        <li key={community.id}>{community.name}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>{" "}
              <h3 className="px-2 text-sm  py-2 font-medium leading-6 text-gray-900">
                {confirmState === "current" ? "Do you want continue?" : ""}
              </h3>
            </div>
          )}
        </div>
        <div className=" flex flex-col mt-4 m-8 border-t py-4">
          <div className="flex flex-row justify-end pb-2 space-x-3">
            {addEmailState !== "current" && resumeState !== "current" && (
              <Button
                template="default"
                customClassName="w-fit"
                label={"Return"}
                type="button"
                onClick={() => {
                  if (confirmState === "current") {
                    setChooseCommunityState("current");
                    setConfirmState("upcoming");
                  } else if (chooseCommunityState === "current") {
                    setAddEmailState("current");
                    setChooseCommunityState("upcoming");
                  }
                }}
              />
            )}
            {invitations.length > 0 && (
              <>
                {addEmailState === "current" && (
                  <Button
                    template="bmatch-primary"
                    customClassName="w-fit"
                    label={"Continue"}
                    type="button"
                    onClick={() => {
                      setAddEmailState("complete");
                      setChooseCommunityState("current");
                    }}
                    disabled={invitations.length <= 0}
                  />
                )}
                {chooseCommunityState === "current" && (
                  <Button
                    template="bmatch-primary"
                    customClassName="w-fit"
                    label={"Resume"}
                    type="button"
                    onClick={() => {
                      setChooseCommunityState("complete");
                      setConfirmState("current");
                    }}
                    disabled={invitations.length <= 0}
                  />
                )}
                {confirmState === "current" && (
                  <Button
                    template="bmatch-primary"
                    customClassName="w-fit"
                    label={"Invite users"}
                    type="submit"
                    onClick={() => {
                      onSubmit();
                    }}
                    disabled={invitations.length <= 0}
                  />
                )}
                {confirmState === "complete" && (
                  <Button
                    template="bmatch-primary"
                    customClassName="w-fit"
                    label={"Done"}
                    type="submit"
                    onClick={() => {
                      onClickCreateInvitation();
                      resetModal();
                    }}
                    disabled={invitations.length <= 0}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateInvitation;
