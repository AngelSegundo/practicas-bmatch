import { useEffect, useState } from "react";

export const LoadingBar = () => {
  const [barStart, setBrStart] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrStart((prevValue) => {
        if (prevValue < 145) {
          return prevValue + 1;
        } else {
          return 0;
        }
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-blue-50 rounded-full h-2 overflow-hidden relative">
      <div
        className="bg-blue-400 h-2 rounded-full relative"
        style={{ width: "60%", left: `${barStart - 45}%` }}
      />
    </div>
  );
};
