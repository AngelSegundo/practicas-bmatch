import { XIcon } from "@heroicons/react/solid";
import { Goal, GoalDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailGoal from "./DetailGoal";

interface ModalCreateGoalProps {
  openModalCreateGoal: boolean;
  onClickCreateGoal: () => void;
  listDomains?: string[] | undefined;
  onSubmitGoal: (goal: Goal) => Promise<{ data: GoalDTO } | void>;
  isLoading?: boolean;
}
const ModalCreateGoal: FunctionComponent<ModalCreateGoalProps> = ({
  openModalCreateGoal,
  onClickCreateGoal,
  onSubmitGoal,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={openModalCreateGoal}
      onClose={onClickCreateGoal}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Create Goal</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateGoal}
          />
        </div>
        <DetailGoal
          onSubmitGoal={onSubmitGoal}
          isCreateGoalModal={true}
          onModalClose={onClickCreateGoal}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateGoal;
