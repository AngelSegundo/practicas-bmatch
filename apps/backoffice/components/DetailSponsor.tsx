import { FunctionComponent } from "react";
import { Sponsor } from "domain/entities";
interface DetailSponsorProps {
  sponsor?: Sponsor;
}

const DetailSponsor: FunctionComponent<DetailSponsorProps> = ({ sponsor }) => {
  return (
    <div className="mt-10 px-8 grid grid-cols-1 sm:grid-cols-6 gap-y-6 gap-x-4">
      <div className="sm:col-span-6 text-base leading-6 font-medium text-gray-900">
        <div className="w-full flex flex-col flex-1">
          <div className="items-center flex justify-between ">
            <div className="flex items-start w-full">
              <h1 className="text-xl leading-8 font-semibold">Sponsor</h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-8 bg-white shadow overflow-hidden rounded-lg p-5">
            <div className="flex h-all col-span-4 items-center space-x-3">
              <h3 className="text-l leading-5 font-semibold text-gray-900 w-all h-8 flex items-center">
                {sponsor?.commercialName}
              </h3>
            </div>
            <div className="col-span-2 space-y-4">
              <div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Legal Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 ">
                    {sponsor?.legalName}
                  </dd>
                </div>
              </div>
              <div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 ">
                    {sponsor?.legalName}
                  </dd>
                </div>
              </div>

              <div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 ">
                    {sponsor?.taxId}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailSponsor;
