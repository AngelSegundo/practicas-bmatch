import { FunctionComponent, ReactNode } from "react";
import { XIcon } from "@heroicons/react/outline";
import { Modal } from "ui";
import { useTranslation } from "next-i18next";
import { Button } from "ui";
import { TrashIcon } from "@heroicons/react/solid";

interface ModalDeleteWarningProps {
  isOpen: boolean;
  title: string;
  cancelActionLabel?: string;
  closeActionLabel?: string;
  onCancel: () => void;
  onAccept: () => void;
  children?: ReactNode;
}
export const ModalDeleteWarning: FunctionComponent<ModalDeleteWarningProps> = ({
  isOpen,
  title,
  cancelActionLabel,
  closeActionLabel,
  onCancel,
  onAccept,
  children,
}) => {
  const { t } = useTranslation("common");
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} bg="bg-gray-50" size="xl" onClose={onCancel}>
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-end">
          <XIcon
            className="h-6 w-6 text-gray-400"
            aria-hidden="true"
            role="button"
            onClick={onCancel}
          />
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-row justify-start gap-x-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex justify-center items-center">
              <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="flex-1 text-left mt-1">
              <p className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </p>
              {children}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              template="default"
              customClassName="w-fit"
              label={cancelActionLabel || t("common:button:return")}
              type="button"
              onClick={onCancel}
            />
            <Button
              template="danger"
              customClassName="w-fit"
              label={closeActionLabel || t("common:label:out")}
              type="submit"
              onClick={onAccept}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
