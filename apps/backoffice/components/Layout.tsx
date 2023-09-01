import {
  FunctionComponent,
  ReactNode,
  useState,
  Fragment,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import {
  MenuIcon,
  XIcon,
  UsersIcon,
  ReceiptTaxIcon,
  OfficeBuildingIcon,
  ViewGridAddIcon,
  LightningBoltIcon,
  ThumbUpIcon,
  LightBulbIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinnerCard from "ui/LoadingSpinnerCard";
import LogOutIcon from "../icons/LogOut";
import { UserAvatar } from "ui";
import { useAuth } from "../contexts/AuthContext";
import { useAppSelector } from "../store/root";
import { useLazyGetOfficerByIdQuery } from "../store/services/officer";

interface ILayoutProps {
  children: ReactNode;
}

const Layout: FunctionComponent<ILayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const userId = useAppSelector((state) => state.auth.user?.uid);
  const [getOfficer, { data: user }] = useLazyGetOfficerByIdQuery();

  useEffect(() => {
    if (!userId) return;
    getOfficer(userId);
  }, [userId]);

  const navigation = [
    {
      name: "Sponsors",
      href: "/sponsors",
      icon: OfficeBuildingIcon,
      current: router.pathname.split("/")[1] === "sponsors",
    },
    {
      name: "Users",
      href: "/users",
      icon: UsersIcon,
      current: router.pathname.split("/")[1] === "users",
    },
    {
      name: "Rewards",
      href: "/rewards",
      icon: ReceiptTaxIcon,
      current: router.pathname.split("/")[1] === "rewards",
    },
    {
      name: "Communities",
      href: "/communities",
      icon: ViewGridAddIcon,
      current: router.pathname.split("/")[1] === "communities",
    },
    {
      name: "Services",
      href: "/services",
      icon: LightningBoltIcon,
      current: router.pathname.split("/")[1] === "services",
    },
    {
      name: "Tips",
      href: "/tips",
      icon: LightBulbIcon,
      current: router.pathname.split("/")[1] === "tips",
    },
    {
      name: "Goals",
      href: "/goals",
      icon: ThumbUpIcon,
      current: router.pathname.split("/")[1] === "goals",
    },
    {
      name: "Insights",
      href: "/insights",
      icon: ThumbUpIcon,
      current: router.pathname.split("/")[1] === "insights",
    },
  ];

  const classNames = (...classes: string[]): string => {
    return classes.filter(Boolean).join(" ");
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  async function handleLogoutClick() {
    await signOut();
    router.replace("/login");
  }

  const startLoding = () => setIsLoading(true);
  const endLoading = () => setIsLoading(false);

  useEffect(() => {
    router.events.on("routeChangeStart", startLoding);
    router.events.on("routeChangeComplete", endLoading);

    return () => {
      router.events.off("routeChangeStart", startLoding);
      router.events.off("routeChangeComplete", endLoading);
    };
  }, [router]);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Image
                      objectFit="contain"
                      src="/assets/bmatch.svg"
                      unoptimized={true}
                      width={100}
                      height={19}
                      alt="bmatch"
                    />
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 flex-shrink-0 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex-col flex border-t border-gray-200 px-4">
                  <button className="flex-shrink-0 group block">
                    <div className="flex items-center py-3">
                      <div>
                        <UserAvatar
                          name={user?.name}
                          surname={user?.surname}
                          size="sm"
                        />
                      </div>
                      <div className="flex flex-row text-sm font-medium text-gray-600 group-hover:text-gray-900 px-2 space-x-1">
                        <p>{user?.name}</p>
                        <p>{user?.surname}</p>
                      </div>
                    </div>
                  </button>
                  <button type="button" onClick={handleLogoutClick}>
                    <div className="flex items-center pt-3 pb-6">
                      <LogOutIcon />
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 px-2">
                        Log out
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14"></div>
          </Dialog>
        </Transition.Root>
        <div className="hidden md:flex md:w-44 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Image
                  objectFit="contain"
                  src="/assets/bmatch.svg"
                  unoptimized={true}
                  width={120}
                  height={30}
                  alt="bmatch"
                />
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500",
                          "mr-3 flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex-col flex border-t border-gray-200 px-4">
              <button className="flex-shrink-0 group block">
                <div className="flex items-center py-3">
                  <div>
                    <UserAvatar
                      name={user?.name}
                      surname={user?.surname}
                      size="sm"
                    />
                  </div>
                  <div className="flex flex-row text-sm font-medium text-gray-600 group-hover:text-gray-900 px-2 space-x-1">
                    <p>{user?.name}</p>
                    <p>{user?.surname}</p>
                  </div>
                </div>
              </button>
              <button type="button" onClick={handleLogoutClick}>
                <div className="flex items-center pt-3 pb-6">
                  <LogOutIcon />
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 px-2">
                    Log out
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="md:pl-44 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            {isLoading ? (
              <div className="flex-1">
                <LoadingSpinnerCard translucent={true} text="Loading" />
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
