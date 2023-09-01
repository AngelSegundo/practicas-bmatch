import { XIcon } from "@heroicons/react/solid";
import { Insight, InsightDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailInsight from "./DetailInsight";

interface ModalEditInsightProps {
  openModalEditInsight: boolean;
  insight: InsightDTO;
  onCloseModal: () => void;
  listDomains?: string[] | undefined;
  onSubmitEditInsight: (
    insight: Insight
  ) => Promise<{ data: InsightDTO } | void>;
  isLoading?: boolean;
}
const ModalEditInsight: FunctionComponent<ModalEditInsightProps> = ({
  openModalEditInsight,
  onCloseModal,
  onSubmitEditInsight,
  isLoading,
  insight,
}) => {
  return (
    <Modal
      isOpen={openModalEditInsight}
      onClose={onCloseModal}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Actualizar Ideas</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onCloseModal}
          />
        </div>
        <DetailInsight
          onSubmitInsight={onSubmitEditInsight}
          isCreateInsightModal={false}
          onModalClose={onCloseModal}
          isLoading={isLoading}
          insight={insight}
        />
      </div>
    </Modal>
  );
};

export default ModalEditInsight;
