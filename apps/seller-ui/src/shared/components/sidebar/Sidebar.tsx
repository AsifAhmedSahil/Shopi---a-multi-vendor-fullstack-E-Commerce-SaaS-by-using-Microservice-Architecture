"use client";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import SidebarItems from "./sidebar.items";
import { IoHome, IoSettings,IoLogOutOutline } from "react-icons/io5";
import SidebarMenu from "./sidebar.menu";
import {
  BsBell,
  BsCalendarEvent,
  BsCurrencyDollar,
  
  BsList,
  BsMailbox,
  BsPlus,
  BsSearch,
} from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import { MdPercent } from "react-icons/md";


const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathname = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflow: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-2">
            Shopi
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
              <h5 className="font-medium text-xs text-white whitespace-nowrap overflow-hidden text-start">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>

      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar flex flex-col">
          <SidebarItems
            title="Dashboard"
            icon={<IoHome fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />

          <SidebarMenu title="Main Menu">
            <SidebarItems
              title="Orders"
              href="/dashboard/orders"
              icon={
                <BsList size={26} color={getIconColor("/dashboard/orders")} />
              }
              isActive={activeSidebar === "/orders"}
            />
            <SidebarItems
              title="Payments"
              href="/dashboard/payments"
              icon={
                <BsCurrencyDollar
                  size={26}
                  color={getIconColor("/dashboard/payments")}
                />
              }
              isActive={activeSidebar === "/dashboard/payments"}
            />
          </SidebarMenu>

          <SidebarMenu title="Products">
            <SidebarItems
              title="Create Products"
              href="/dashboard/create-products"
              icon={
                <BsPlus
                  size={26}
                  color={getIconColor("/dashboard/create-product")}
                />
              }
              isActive={activeSidebar === "/dashboard/create-product"}
            />
            <SidebarItems
              title="All Products"
              href="/dashboard/all-products"
              icon={
                <BsSearch
                  size={22}
                  color={getIconColor("/dashboard/all-products")}
                />
              }
              isActive={activeSidebar === "/dashboard/all-products"}
            />
          </SidebarMenu>

          <SidebarMenu title="Events">
            <SidebarItems
              title="Create Events"
              href="/dashboard/create-events"
              icon={
                <BsCalendarEvent
                  size={24}
                  color={getIconColor("/dashboard/create-events")}
                />
              }
              isActive={activeSidebar === "/dashboard/create-events"}
            />
            <SidebarItems
              title="All Events"
              href="/dashboard/all-events"
              icon={
                <BsBell
                  size={24}
                  color={getIconColor("/dashboard/all-events")}
                />
              }
              isActive={activeSidebar === "/dashboard/all-events"}
            />

          </SidebarMenu>
          <SidebarMenu title="Controllers">
            <SidebarItems
              title="Inbox"
              href="/dashboard/inbox"
              icon={
                <BsMailbox
                  size={22}
                  color={getIconColor("/dashboard/inbox")}
                />
              }
              isActive={activeSidebar === "/dashboard/inbox"}
            />
            <SidebarItems
              title="Settings"
              href="/dashboard/settings"
              icon={
                <IoSettings
                  size={22}
                  color={getIconColor("/dashboard/settings")}
                />
              }
              isActive={activeSidebar === "/dashboard/settings"}
            />
            <SidebarItems
              title="Notification"
              href="/dashboard/notifications"
              icon={
                <MdNotificationsActive
                  size={24}
                  color={getIconColor("/dashboard/notifications")}
                />
              }
              isActive={activeSidebar === "/dashboard/notifications"}
            />


          </SidebarMenu>
          <SidebarMenu title="Extras">
            <SidebarItems
              title="Discount Codes"
              href="/dashboard/discount-codes"
              icon={
                <MdPercent
                  size={22}
                  color={getIconColor("/dashboard/discount-codes")}
                />
              }
              isActive={activeSidebar === "/dashboard/discount-codes"}
            />
            <SidebarItems
              title="Logout"
              href="/logout"
              icon={
                <IoLogOutOutline
                  size={22}
                  color={getIconColor("/logout")}
                />
              }
              isActive={activeSidebar === "/logout"}
            />

          </SidebarMenu>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
