import { XIcon } from "@heroicons/react/solid";
import { Community, CommunityDTO, SponsorDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailCommunity from "./DetailCommunity";

interface ModalCreateCommunityProps {
  openModalCreateCommunity: boolean;
  onClickCreateCommunity: () => void;
  listDomains?: string[] | undefined;
  onSubmitCommunity: (communityInfo: {
    community: Community;
    communityLogo: File | null;
  }) => Promise<{ data: CommunityDTO; communityLogo: File | null } | void>;
  isLoading?: boolean;
  sponsor?: SponsorDTO;
  sponsors?: SponsorDTO[];
  mainView?: boolean;
}
const ModalCreateCommunity: FunctionComponent<ModalCreateCommunityProps> = ({
  openModalCreateCommunity,
  onClickCreateCommunity,
  onSubmitCommunity,
  isLoading,
  sponsor,
  sponsors,
  mainView = false,
}) => {
  return (
    <Modal
      isOpen={openModalCreateCommunity}
      onClose={onClickCreateCommunity}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Create Community</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateCommunity}
          />
        </div>
        {sponsor && (
          <DetailCommunity
            onSubmitCommunity={onSubmitCommunity}
            isCreateCommunityModal={true}
            onModalClose={onClickCreateCommunity}
            isLoading={isLoading}
            sponsor={sponsor}
          />
        )}
        {mainView && sponsors && (
          <DetailCommunity
            onSubmitCommunity={onSubmitCommunity}
            isCreateCommunityModal={true}
            onModalClose={onClickCreateCommunity}
            isLoading={isLoading}
            sponsors={sponsors}
            mainView={mainView}
          />
        )}
      </div>
    </Modal>
  );
};

export default ModalCreateCommunity;
