import { XIcon } from "@heroicons/react/solid";
import { Sponsor } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailSponsorForm from "./DetailSponsorForm";

interface ModalCreateSponsorProps {
  openModalCreateSponsor: boolean;
  onClickCreateSponsor: () => void;
  listDomains?: string[] | undefined;
  onSubmitSponsor: (sponsor: Sponsor) => Promise<{ data: Sponsor } | void>;
  isLoading?: boolean;
}
const ModalCreateSponsor: FunctionComponent<ModalCreateSponsorProps> = ({
  openModalCreateSponsor,
  onClickCreateSponsor,
  onSubmitSponsor,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={openModalCreateSponsor}
      onClose={onClickCreateSponsor}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Create Sponsor</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateSponsor}
          />
        </div>
        <DetailSponsorForm
          onSubmitSponsor={onSubmitSponsor}
          isCreateSponsorModal={true}
          onModalClose={onClickCreateSponsor}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateSponsor;
