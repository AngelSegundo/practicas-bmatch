import { XIcon } from "@heroicons/react/solid";
import {
  ServiceConnectionDTO,
  ServiceReading,
  ServiceReadingDTO,
} from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailReading from "./DetailReading";

interface ModalReadingDetailProps {
  openModalReadingDetail: boolean;
  onClickReadingDetail: () => void;
  listDomains?: string[] | undefined;
  onSubmitReading: (
    reading: ServiceReading,
    isAnUpdate: boolean,
    id?: string
  ) => Promise<{ data: ServiceReading } | void>;
  isLoading?: boolean;
  connection: ServiceConnectionDTO;
  readings?: ServiceReadingDTO[];
  reading?: ServiceReadingDTO;
}
const ModalReadingDetail: FunctionComponent<ModalReadingDetailProps> = ({
  openModalReadingDetail,
  onClickReadingDetail,
  onSubmitReading,
  isLoading,
  connection,
  readings,
  reading,
}) => {
  return (
    <Modal
      isOpen={openModalReadingDetail}
      onClose={onClickReadingDetail}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Reading</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickReadingDetail}
          />
        </div>
        <DetailReading
          onSubmitReading={onSubmitReading}
          isLoading={isLoading}
          connection={connection}
          readings={readings}
          reading={reading}
        />
      </div>
    </Modal>
  );
};

export default ModalReadingDetail;
