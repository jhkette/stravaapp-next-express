"use client";
import {
  HomeIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  CalendarIcon,
  ArrowLeftEndOnRectangleIcon,

} from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { MouseEventHandler } from "react";
import Link from "next/link";
import { authorise, deauthorise } from "../../lib/authSlice";
import styles from "./page.module.css";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import clsx from "clsx";import {
  useLogoutMutation,
  useGetUserQuery,
  useGetLatestQuery,
} from "@/lib/activitySlice";
import { useRouter } from "next/navigation";

export default function NavLinks() {

  const [logout, { error }] = useLogoutMutation();
  const router = useRouter();

  const dispatch = useDispatch()
  const logoutButton = async (e: MouseEventHandler<HTMLAnchorElement> | undefined) => {
    console.log("HELLO LGOIUT")
    Cookies.remove("token")
    const res = await logout();
    dispatch(deauthorise())
    router.push("/");
  };

  const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
      name: "Cycling analytics",
      href: "/dashboard/cyling",
      icon: PresentationChartBarIcon,
    },
    {
      name: "Running analytics",
      href: "/dashboard/running",
      icon: PresentationChartLineIcon,
    },
    { name: "Calender icons", href: "/dashboard/calender", icon: CalendarIcon },
    {
      name: "logout",
      href: "/",
      icon: ArrowLeftEndOnRectangleIcon,
      click: logoutButton,
    },
  ];

  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            //@ts-ignore
            onClick={link.click ? link.click : undefined }
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
