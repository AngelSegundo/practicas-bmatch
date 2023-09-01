import React, { FunctionComponent, Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

interface ModalProps {
  children?: ReactNode;
  isOpen: boolean;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  bg?: "bg-white" | string;
  onClose: () => void;
}

export const Modal: FunctionComponent<ModalProps> = ({
  children,
  isOpen,
  size = "md",
  bg = "bg-white",
  onClose,
}) => {
  const childrenCointainerClassName = classNames(
    "m-4 w-full max-h-[94vh] transform rounded-md p-4 text-left align-middle shadow-xl transition-all flex overflow-y-auto",
    bg,
    {
      "max-w-xs": size === "xs",
      "max-w-sm": size === "sm",
      "max-w-md": size === "md",
      "max-w-lg": size === "lg",
      "max-w-xl": size === "xl",
      "max-w-2xl": size === "2xl",
      "max-w-3xl": size === "3xl",
      "max-w-4xl": size === "4xl",
      "max-w-5xl": size === "5xl",
      "max-w-6xl": size === "6xl",
      "max-w-7xl": size === "7xl",
      "max-w-full": size === "full",
      // max h añadido para modal de informe con scroll
    }
  );

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex max-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={childrenCointainerClassName}>
                  <>{children}</>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
