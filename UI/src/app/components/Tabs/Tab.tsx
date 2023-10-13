import React from "react";

export interface ITabProps {
  disabled?: boolean;
  header: string;
  tabId: string;
  children?: React.ReactNode;
}

export default function Tab(props: ITabProps) {
  return <>{props.children}</>;
}
