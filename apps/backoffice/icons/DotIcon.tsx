interface DotIconProps {
  color?: string;
}

const DotIcon: React.FunctionComponent<DotIconProps> = ({
  color = "#609AFE",
}) => {
  return (
    <svg
      width="16"
      height="21"
      viewBox="0 0 16 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 12.8C15 8.824 8 2 8 2C8 2 1 8.824 1 12.8C1 16.776 4.134 20 8 20C11.866 20 15 16.776 15 12.8Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default DotIcon;
