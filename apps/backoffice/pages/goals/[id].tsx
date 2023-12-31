import Head from "next/head";
import { LoadingBar } from "ui";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import router from "next/router";
import Spinner from "ui/Spinner";
import { Goal, ServiceType } from "domain/entities";
import { useLazyGetCommunitiesBySponsorIdQuery } from "../../store/services/community";
import {
  useGetGoalByIdQuery,
  useUpdateGoalMutation,
} from "../../store/services/goal";
import DetailGoal from "../../components/DetailGoal";
import { showAlert } from "../../store/slices/notifications";
import { useAppDispatch } from "../../store/root";
import DotIcon from "../../icons/DotIcon";

export default function GoalIdPage() {
  const id = router.query.id as string;
  const { data: goalData, isLoading: isGoalLoading } = useGetGoalByIdQuery(id);
  const dispatch = useAppDispatch();
  const [getCommunities] = useLazyGetCommunitiesBySponsorIdQuery();

  useEffect(() => {
    if (isGoalLoading) return;
    if (!isGoalLoading && goalData) {
      getCommunities(goalData.id);
    }
  }, [isGoalLoading, goalData]);

  const [
    updateGoal,
    { data: updatedGoalData, isLoading: isUpdatedGoalLoading },
  ] = useUpdateGoalMutation();
  const onUpdateGoal = async (goal: Goal) => {
    const data = {
      type: goal?.type || ServiceType.water,
      value: goal?.value || 0,
    };
    if (goalData) {
      await updateGoal({
        id: goalData.id,
        data: data,
      }).unwrap();
    }
  };
  useEffect(() => {
    if (isUpdatedGoalLoading) return;
    if (!isUpdatedGoalLoading && updatedGoalData) {
      dispatch(
        showAlert({
          template: "success",
          text: "The goal has been updated",
        })
      );
    }
  }, [updatedGoalData, isUpdatedGoalLoading]);

  const typeServices = {
    [ServiceType.water]: {
      label: "Water",
      icon: <DotIcon aria-hidden="true" />,
    },
    [ServiceType.gas]: {
      label: "Gas",
      icon: <DotIcon aria-hidden="true" color={"#FF6133"} />,
    },
    [ServiceType.electricity]: {
      label: "Electricity",
      icon: <DotIcon aria-hidden="true" color={"#FFD133"} />,
    },
    [ServiceType.freeway]: {
      label: "FreeWay",
      icon: <DotIcon aria-hidden="true" color={"#0000"} />,
    },
  };

  return (
    <div>
      {isGoalLoading ? (
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="grid grid-rows-2 justify-items-center px-5 py-5 shadow-md rounded-md bg-white w-fit h-28">
            <Spinner />
            <h6 className="text-sm leading-5 font-normal">Loading Goal</h6>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-start justify-start bg-gray-50 w-full h-screen">
          <Head>
            <title>Bmatch - dev</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {goalData ? (
            <div className="w-full pt-4 flex flex-col flex-1">
              <div className="flex px-8 justify-between h-10">
                <div className="flex items-end w-full space-x-3">
                  <div className="flex flex-row space-x-3 items-center">
                    {typeServices[goalData.type].icon}
                    <h1 className="text-xl leading-8 font-semibold text-gray-600 cursor-pointer w-fit">
                      {typeServices[goalData.type].label}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full text-sm text-gray-500 leading-8 font-semibold space-x-2">
                <DetailGoal goal={goalData} onSubmitGoal={onUpdateGoal} />
              </div>
            </div>
          ) : (
            <LoadingBar />
          )}
        </div>
      )}
    </div>
  );
}

GoalIdPage.getLayout = (page: JSX.Element) => {
  return <Layout>{page}</Layout>;
};
