import React, { FunctionComponent } from "react";
import { Alert } from "ui";
import { useAppDispatch, useAppSelector } from "../store/root";
import { hideAlert } from "../store/slices/notifications";

const AlertProvider: FunctionComponent<{ children: JSX.Element }> = ({
  children,
}) => {
  const state = useAppSelector((state) => state.notifications.alert);
  const dispatch = useAppDispatch();

  return (
    <>
      {children}
      {state !== null && (
        <Alert
          template={state.template}
          text={state.text}
          onClose={() => dispatch(hideAlert())}
        />
      )}
    </>
  );
};

export default AlertProvider;
