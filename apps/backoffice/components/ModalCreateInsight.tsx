import { XIcon } from "@heroicons/react/solid";
import { Insight, InsightDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailInsight from "./DetailInsight";

interface ModalCreateInsightProps {
  openModalCreateInsight: boolean;
  listDomains?: string[] | undefined;
  onClickCreateInsight: () => void;
  onSubmitInsight: (insight: Insight) => Promise<{ data: InsightDTO } | void>;
  isLoading?: boolean;
}

const ModalCreateInsight: FunctionComponent<ModalCreateInsightProps> = ({
  openModalCreateInsight,
  onClickCreateInsight,
  onSubmitInsight,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={openModalCreateInsight}
      onClose={onClickCreateInsight}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Crear Ideas</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateInsight}
          />
        </div>
        <DetailInsight
          onSubmitInsight={onSubmitInsight}
          isCreateInsightModal={true}
          onModalClose={onClickCreateInsight}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateInsight;
