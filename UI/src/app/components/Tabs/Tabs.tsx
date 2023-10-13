import React, { useState } from "react";
import classnames from "classnames";
import { ITabProps } from "./Tab";
import "./Tabs.scss";

import { NavItem, NavLink, Nav, TabContent, TabPane } from "reactstrap";

export interface ITabsProps {
  children: React.ReactElement<ITabProps> | React.ReactElement<ITabProps>[];
  style?: React.CSSProperties;
  tabStyle?: React.CSSProperties;
  activeTabStyle?: React.CSSProperties;
  onTabSelect?: (tabId: string) => void;
  contentClassName?: string;
}

function Tabs(props: ITabsProps) {
  const tabs = Array.isArray(props.children)
    ? props.children
    : [props.children];
  const [activeTab, setActiveTab] = useState(tabs[0].props.tabId);
  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      props.onTabSelect && props.onTabSelect(tab);
    }
  };

  const style: React.CSSProperties = { padding: "0 1.5rem", cursor: "pointer" };

  if (props.style) {
    Object.assign(style, props.style);
  }

  return (
    <>
      <Nav tabs style={style}>
        {tabs.map((tab) => (
          <NavItem key={"nav-" + tab.props.tabId}>
            <NavLink
              disabled={tab.props.disabled}
              style={
                activeTab === tab.props.tabId
                  ? props.activeTabStyle
                  : props.tabStyle
              }
              className={classnames({
                active: activeTab === tab.props.tabId,
              })}
              onClick={() => toggle(tab.props.tabId)}
            >
              <span className="tab-header noselect">{tab.props.header}</span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent className={props.contentClassName} activeTab={activeTab}>
        {tabs
          .filter((x) => x.props.tabId === activeTab)
          .map((tab) => (
            <TabPane key={tab.props.tabId} tabId={tab.props.tabId}>
              {tab.props.children}
            </TabPane>
          ))}
      </TabContent>
    </>
  );
}

export default Tabs;
