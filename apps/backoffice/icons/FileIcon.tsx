interface FileIconProps {
  className?: string;
}
const FileIcon: React.FunctionComponent<FileIconProps> = ({
  className = "",
}) => {
  return (
    <svg
      className={className}
      width="21"
      height="28"
      viewBox="0 0 31 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.34863 21H21.3486M15.3486 15L15.3486 27M25.3486 37H5.34863C3.13949 37 1.34863 35.2091 1.34863 33V5C1.34863 2.79086 3.13949 1 5.34863 1H16.5202C17.0506 1 17.5593 1.21071 17.9344 1.58579L28.7628 12.4142C29.1379 12.7893 29.3486 13.298 29.3486 13.8284V33C29.3486 35.2091 27.5578 37 25.3486 37Z"
        stroke="#6B7280"
      />
    </svg>
  );
};

export default FileIcon;
