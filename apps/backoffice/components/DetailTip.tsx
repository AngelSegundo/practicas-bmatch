import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button, InputNumber, InputTextArea, LoadingBar } from "ui";
import { Controller, useForm } from "react-hook-form";
import { Tip, TipDTO } from "domain/entities";
import {
  useUpdateImageMutation,
  useDeleteTipImageMutation,
} from "../store/services/tip";
import Image from "next/image";
import { XCircleIcon } from "@heroicons/react/solid";

interface DetailTipProps {
  tip?: TipDTO;
  onModalClose?: () => void;
  onSubmitTip: (data: {
    tip: Tip;
    image: File | null;
  }) => Promise<{ data: TipDTO; image: File | null } | void>;
  isCreateTipModal?: boolean;
  isLoading?: boolean;
}
const DetailTip: FunctionComponent<DetailTipProps> = ({
  tip,
  onSubmitTip,
  isCreateTipModal = false,
  isLoading = false,
}) => {
  const [updateImage] = useUpdateImageMutation();
  const [deleteImage] = useDeleteTipImageMutation();

  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      text: "",
      order: 0,
      image: tip?.image || "",
    },
  });

  const onSubmit = handleSubmit(async (data: Tip, event) => {
    event?.preventDefault();
    const { image, ...tipData } = data;
    data.order = Number(data.order);
    onSubmitTip({
      tip: tipData,
      image: tipImage,
    });
  });

  const handleDeleteImage = async () => {
    if (!tip) return;

    const newTipData = await deleteImage({
      id: tip?.id,
      image: "",
    }).unwrap();

    reset(newTipData);
  };

  useEffect(() => {
    reset({
      ...tip,
    });
  }, [JSON.stringify(tip)]);

  const [tipImage, setTipImage] = useState<null | File>(null);

  const handleUploadLogo = async (file: File) => {
    if (!tip) return;
    const formData = new FormData();
    formData.append("image", file);
    const fileData = await updateImage({
      id: tip?.id,
      data: formData,
    }).unwrap();
    reset();
    return fileData;
  };

  const onSelectNewLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTipImage(file);
    handleUploadLogo(file);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-5 gap-y-6 gap-x-4">
        <Controller
          control={control}
          name="text"
          defaultValue=""
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <InputTextArea
              id="text"
              value={value ?? ""}
              label="Text"
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              rows={5}
              containerClassName="sm:col-span-6"
            />
          )}
        />
        <Controller
          control={control}
          name="order"
          rules={{
            required: {
              value: true,
              message: "This field is required",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <InputNumber
              id="order"
              value={value as unknown as string}
              label="Orden"
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="sm:col-span-1 sm:col-start-1"
            />
          )}
        />
        <div className="h-all col-span-3 pl-10">
          <p className="block text-base sm:text-sm font-medium text-gray-700">
            Imagen
          </p>
          <div className="flex items-end w-auto space-x-3 pt-2">
            {tipImage || tip?.image ? (
              <div className="relative">
                <div
                  className="absolute top-1 right-1 z-10 cursor-pointer"
                  onClick={() => handleDeleteImage()}
                >
                  <XCircleIcon className="w-6 h-6" />
                </div>
                <Image
                  src={
                    tipImage
                      ? URL.createObjectURL(tipImage)
                      : (tip?.image as string)
                  }
                  unoptimized={true}
                  alt="Tip image"
                  width={100}
                  height={100}
                  objectFit="contain"
                  className="flex items-center justify-center flex-shrink-0 p-1"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-white h-16 w-16 text-2xl bg-gray-300 hover:bg-gray-400 flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2">
                <span className="uppercase">{""}</span>
              </div>
            )}
            <div className="flex flex-col items-end mt-4 whitespace-nowrap">
              <label className="group relative flex justify-center items-center px-4 h-10 text-base sm:text-sm font-medium rounded-md focus:outline-none border border-gray-300 text-gray-700 bg-white hover:bg-gray-100">
                <span>Subir imagen</span>
                <input
                  id="profileLogo"
                  name="profileLogo"
                  type="file"
                  className="sr-only"
                  onChange={onSelectNewLogo}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b p-4 mx-6"></div>
      <div className="flex flex-col items-end mt-4 py-3 px-8">
        {isLoading ? (
          <LoadingBar />
        ) : (
          <Button
            template="bmatch-primary"
            customClassName="w-fit"
            label={isCreateTipModal ? "Create tip" : "Save changes"}
            type="submit"
            onClick={onSubmit}
          />
        )}
      </div>
    </form>
  );
};
export default DetailTip;
