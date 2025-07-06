import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex flex-col mt-4">
      <h3 className="text-xs tracking-wide text-gray-400 px-4 mb-1 uppercase">
        {title}
      </h3>
      <div className="pl-4 flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};

export default SidebarMenu;
