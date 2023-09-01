import { XIcon } from "@heroicons/react/solid";
import { Tip, TipDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailTip from "./DetailTip";

interface ModalCreateTipProps {
  openModalCreateTip: boolean;
  onClickCreateTip: () => void;
  listDomains?: string[] | undefined;
  onSubmitTip: (data: {
    tip: Tip;
    image: File | null;
  }) => Promise<{ data: TipDTO; image: File | null } | void>;
  isLoading?: boolean;
}
const ModalCreateTip: FunctionComponent<ModalCreateTipProps> = ({
  openModalCreateTip,
  onClickCreateTip,
  onSubmitTip,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={openModalCreateTip}
      onClose={onClickCreateTip}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Create Tip</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateTip}
          />
        </div>
        <DetailTip
          onSubmitTip={onSubmitTip}
          isCreateTipModal={true}
          onModalClose={onClickCreateTip}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateTip;
