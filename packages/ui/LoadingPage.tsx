import { FunctionComponent } from "react";
import Image from "next/image";
import { LoadingBar } from "ui";
import { useTranslation } from "next-i18next";
interface LoadingPageProps {
  hideLogo?: boolean;
  text?: string;
}

export const LoadingPage: FunctionComponent<LoadingPageProps> = ({
  hideLogo = true,
  text,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="w-screen absolute top-0 left-0 h-screen flex flex-col items-center justify-center bg-blue-50/70 z-50">
      <div className="flex flex-col items-center gap-6 bg-slate-50 rounded-md shadow-md py-8 px-10 w-80">
        {!hideLogo && (
          <Image
            src="/assets/bmatch.svg"
            width={126}
            height={24}
            alt="bmatch"
          />
        )}
        {text && <h6>{text}</h6>}
        <LoadingBar />
      </div>
    </div>
  );
};
