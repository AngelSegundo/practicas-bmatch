import { XIcon } from "@heroicons/react/solid";
import { Service, ServiceDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailService from "./DetailService";

interface ModalCreateServiceProps {
  openModalCreateService: boolean;
  onClickCreateService: () => void;
  listDomains?: string[] | undefined;
  onSubmitService: (serviceInfo: {
    service: Service;
    serviceLogo: File | null;
  }) => Promise<{ data: ServiceDTO; serviceLogo: File | null } | void>;
  isLoading?: boolean;
}

const ModalCreateService: FunctionComponent<ModalCreateServiceProps> = ({
  openModalCreateService,
  onClickCreateService,
  onSubmitService,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={openModalCreateService}
      onClose={onClickCreateService}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Create Service</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onClickCreateService}
          />
        </div>
        <DetailService
          onSubmitService={onSubmitService}
          isCreateServiceModal={true}
          onModalClose={onClickCreateService}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateService;
