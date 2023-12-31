interface FolderIconProps {
  className?: string;
  currentColor?: string;
}
const FolderIcon: React.FunctionComponent<FolderIconProps> = ({
  className = "",
  currentColor,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke={currentColor}
      strokeWidth="1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
};

export default FolderIcon;
