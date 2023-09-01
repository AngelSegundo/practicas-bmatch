import { XIcon } from "@heroicons/react/solid";
import { Reward, RewardDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailReward from "./DetailReward";

interface ModalCreateRewardProps {
  openModalCreateReward: boolean;
  onClickCreateReward: () => void;
  listDomains?: string[] | undefined;
  onSubmitReward: (rewardInfo: {
    reward: Reward;
    picture: File | null;
  }) => Promise<{ data: RewardDTO; picture: File | null } | void>;
  isLoading?: boolean;
}
const ModalCreateReward: FunctionComponent<ModalCreateRewardProps> = ({
  openModalCreateReward,
  onClickCreateReward,
  onSubmitReward,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={openModalCreateReward}
      onClose={onClickCreateReward}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Create Reward</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateReward}
          />
        </div>
        <DetailReward
          onSubmitReward={onSubmitReward}
          isCreateRewardModal={true}
          onModalClose={onClickCreateReward}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateReward;
