import { FunctionComponent, useEffect } from "react";
import { Button, InputNumber, InputText, LoadingBar } from "ui";
import { Controller, useForm } from "react-hook-form";
import { Goal, GoalDTO, ServiceType } from "domain/entities";

interface DetailGoalProps {
  goal?: GoalDTO;
  onModalClose?: () => void;
  onSubmitGoal: (data: Goal) => Promise<{ data: GoalDTO } | void>;
  isCreateGoalModal?: boolean;
  isLoading?: boolean;
}
const DetailGoal: FunctionComponent<DetailGoalProps> = ({
  goal,
  onSubmitGoal,
  isCreateGoalModal = false,
  isLoading = false,
}) => {
  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      type: ServiceType.water,
      value: 0,
    },
  });

  const onSubmit = handleSubmit(async (data: Goal, event) => {
    event?.preventDefault();
    data.value = parseInt(data.value as unknown as string);
    onSubmitGoal(data);
  });

  useEffect(() => {
    reset({
      ...goal,
    });
  }, [JSON.stringify(goal)]);

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-6 px-8 grid grid-cols-1 sm:grid-cols-5 gap-y-6 gap-x-4">
        <Controller
          control={control}
          name="value"
          defaultValue={0}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <InputNumber
              id="value"
              value={value as unknown as string}
              label="Goal (%)"
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="sm:col-span-1 sm:col-start-1"
            />
          )}
        />
        {goal && (
          <InputText
            id="updatedAt"
            value={`${goal.updatedAt.slice(8, 10)}${goal.updatedAt.slice(
              4,
              8
            )}${goal.updatedAt.slice(0, 4)} ${goal.updatedAt.slice(-10, -2)}`}
            label="Updated at"
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
            label={isCreateGoalModal ? "Create goal" : "Save changes"}
            type="submit"
            onClick={onSubmit}
          />
        )}
      </div>
    </form>
  );
};
export default DetailGoal;
