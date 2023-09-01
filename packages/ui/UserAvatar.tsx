import classNames from "classnames";
import { FunctionComponent, useMemo } from "react";

export interface UserAvatarProps {
  name?: string;
  surname?: string;
  size?: "sm" | "md" | "l" | "xl";
  // imageUrl?: string;
}

export const UserAvatar: FunctionComponent<UserAvatarProps> = ({
  name,
  surname,
  size = "md",
}) => {
  // get first letter of name and surname
  const intials = useMemo(() => {
    return [name, surname]
      .filter((text) => text !== undefined)
      .map((s) => s?.[0]);
  }, [name, surname]);
  return (
    <div
      className={classNames(
        "flex items-center justify-center text-white bg-blue-500 hover:bg-blue-300 flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "h-24 w-24 text-3xl": size === "xl",
          "h-16 w-16 text-2xl": size === "l",
          "h-10 w-10 text-lg": size === "md",
          "h-8 w-8 text-md": size === "sm",
        }
      )}
    >
      <span className="uppercase">{intials}</span>
    </div>
  );
};
