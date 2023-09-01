import classNames from "classnames";

interface TabProps {
  href: string;
  label: string;
  Icon?: JSX.Element;
  selectTab: string;
  onClick: () => void;
}
export function Tab({ label, selectTab, Icon: Icon, onClick }: TabProps) {
  let current = false;
  if (selectTab === label) current = true;

  return (
    <button
      key={label}
      className={classNames(
        current
          ? "border-blue-500 text-blue-500 hover:text-blue-700 hover:border-blue-300"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
        "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm"
      )}
      onClick={onClick}
    >
      {Icon && Icon}

      {label}
    </button>
  );
}
