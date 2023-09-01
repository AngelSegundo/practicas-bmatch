import { FunctionComponent, useEffect, useState } from "react";
import { Button, InputText, LoadingBar, Select } from "ui";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Insight, InsightDTO, InsightLevel } from "domain/entities";
import { useInsightUpdateMutation } from "../store/services/insight";
import { useAppDispatch } from "../store/root";
import { showAlert } from "../store/slices/notifications";

interface DetailInsightProps {
  insight?: InsightDTO;
  onModalClose?: () => void;
  onSubmitInsight: (insight: Insight) => Promise<{ data: InsightDTO } | void>;
  isCreateInsightModal?: boolean;
  isLoading?: boolean;
}

const DetailInsight: FunctionComponent<DetailInsightProps> = ({
  insight,
  onSubmitInsight,
  onModalClose,
  isCreateInsightModal = false,
  isLoading = false,
}) => {
  const [insightsState] = useState<
    {
      value: string;
    }[]
  >([]);

  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      level: InsightLevel.novice,
      insight: [{ value: "" }],
    },
  });

  const {
    fields: fieldsInsight,
    append: appendInsight,
    remove: removeInsight,
  } = useFieldArray({
    control,
    name: "insight",
  });

  const CATEGORY_OPTIONS = [
    {
      value: InsightLevel.expert,
      id: InsightLevel.expert,
    },
    {
      value: InsightLevel.galactic,
      id: InsightLevel.galactic,
    },
    {
      value: InsightLevel.novice,
      id: InsightLevel.novice,
    },
  ];

  const [updateInsight] = useInsightUpdateMutation();
  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit(async (data: Insight, event) => {
    event?.preventDefault();
    const insightData = { ...data };
    if (insight?.id) {
      try {
        updateInsight({ id: insight?.id, data: insightData });
      } catch (error: unknown) {
        const errorCode = error;
        console.log(errorCode);
        dispatch(
          showAlert({
            template: "error",
            text: "Error: Something is wrong",
          })
        );
      }
      dispatch(
        showAlert({
          template: "success",
          text: "Actualizacion exitosa",
        })
      );
    }

    onSubmitInsight(data), onModalClose?.();
  });

  useEffect(() => {
    reset({
      ...insight,
    });
  }, [JSON.stringify(insight)]);

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-6 px-8 sm:col-span-6">
        <div>
          <Controller
            control={control}
            name="level"
            rules={{
              required: {
                value: true,
                message: "Este campo es obligatorio",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Select
                id="level"
                selectOptions={CATEGORY_OPTIONS}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error?.message}
                containerClassName="max-w-lg w-full focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                label="Categoria"
              />
            )}
          />
          {fieldsInsight.map((insight, index) => {
            return (
              <div
                key={insight.id}
                className="mt-4 grid sm:grid-cols-2 gap-y-6 gap-x-4"
              >
                <Controller
                  control={control}
                  name={`insight.${index}.value`}
                  defaultValue=""
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <InputText
                      id={`insight.${index}`}
                      value={value ?? ""}
                      label={`Descripción ${index + 1}`}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      containerClassName="sm:col-span-1"
                    />
                  )}
                />
                <Button
                  customClassName="w-fit mt-6 h-9"
                  label="Remove"
                  type="button"
                  template="danger"
                  onClick={() => removeInsight(index)}
                />
              </div>
            );
          })}
        </div>
        <Button
          customClassName="w-fit h-9 mt-4"
          label="Añadir"
          type="button"
          template="bmatch-primary"
          onClick={() =>
            appendInsight({
              value: "",
            })
          }
        />
        {insightsState.length > 0 &&
          insightsState.map((insight, index) => {
            return (
              <div
                key={index}
                className="mt-3 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4"
              >
                <InputText
                  id="currentConfig.inputId"
                  value={insight.value}
                  label={`Insight ${index + 1}`}
                  containerClassName="sm:col-span-1"
                  disabled={true}
                />
              </div>
            );
          })}
      </div>
      <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-5 gap-y-6 gap-x-4">
        {insight && (
          <InputText
            id="updatedAt"
            value={`${insight.updatedAt.slice(8, 10)}${insight.updatedAt.slice(
              4,
              8
            )}${insight.updatedAt.slice(0, 4)} ${insight.updatedAt.slice(
              -10,
              -2
            )}`}
            label="Ultima actualización:"
            containerClassName="sm:col-span-1 sm:col-start-1"
            disabled={true}
          />
        )}
      </div>
      <div className="border-b p-4 mx-6"></div>
      <div className="flex flex-col items-end mt-4 py-3 px-8">
        {isLoading ? (
          <LoadingBar />
        ) : (
          <Button
            template="bmatch-primary"
            customClassName="w-fit"
            label={isCreateInsightModal ? "Crear" : "Guardar Cambios"}
            type="submit"
            onClick={onSubmit}
          />
        )}
      </div>
    </form>
  );
};
export default DetailInsight;
