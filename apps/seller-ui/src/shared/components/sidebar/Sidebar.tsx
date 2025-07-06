"use client";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathname = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  const getIconColor = (route:string) => activeSidebar === route ? "#0085ff" : "#969696"



  return (
    <Box 
    css={{
      height:"100vh",
      zIndex:202,
      position:"sticky",
      padding:"8px",
      top:"0",
      overflow:"scroll",
      scrollbarWidth:"none"
    }}
    className="sidebar-wrapper"
    >

      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-2">
          Shopi
          <Box>
            <h3>{seller?.shop?.name}</h3>
          </Box>
          </Link>
        </Box>
      </Sidebar.Header>


    </Box>
  );
};

export default SidebarWrapper;
