import { XIcon } from "@heroicons/react/solid";
import { Service, ServiceDTO } from "domain/entities";
import { FunctionComponent } from "react";
import { Modal } from "ui";
import DetailService from "./DetailService";

interface ModalEditServiceProps {
  openModalEditService: boolean;
  service: ServiceDTO;
  onCloseModal: () => void;
  listDomains?: string[] | undefined;
  onSubmitEditService: (serviceInfo: {
    service: Service;
    serviceLogo: File | null;
  }) => Promise<{ data: ServiceDTO; serviceLogo: File | null } | void>;
  isLoading?: boolean;
}
const ModalEditService: FunctionComponent<ModalEditServiceProps> = ({
  openModalEditService,
  onCloseModal,
  onSubmitEditService,
  isLoading,
  service,
}) => {
  return (
    <Modal
      isOpen={openModalEditService}
      onClose={onCloseModal}
      size="5xl"
      bg="bg-white"
    >
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between mt-4 m-8 pb-6 border-b">
          <p className="text-2xl leading-8 font-semibold">Update Service</p>
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onCloseModal}
          />
        </div>
        <DetailService
          onSubmitService={onSubmitEditService}
          isCreateServiceModal={false}
          onModalClose={onCloseModal}
          isLoading={isLoading}
          service={service}
        />
      </div>
    </Modal>
  );
};

export default ModalEditService;
