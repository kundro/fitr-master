import React from "react";
import { Button, Label } from "reactstrap/lib";

import Tabs from "../../../../components/Tabs/Tabs";
import Tab from "../../../../components/Tabs/Tab";
import classNames from "classnames";
import api from "../../../../api";
import {
  ObservableValue,
  Observer,
  Provider,
} from "../../../../../utils/observable";
import SearchInput from "../../../../../utils/input/SearchInput";

export interface ISearchListProps {
  isExpanded?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onAddFlow?: (id: number) => void;
  onAddNode?: (id: number) => void;
}

interface ISearchListItem {
  id: number;
  name: string;
  onAddAction?: (id: number) => void;
}

interface ISearchListItemGroup {
  id: number;
  name: string;
  items: ISearchListItem[];
}

export default function SearchList({
  isExpanded,
  onMouseDown,
  onAddNode,
  onAddFlow,
}: ISearchListProps): JSX.Element {
  const styles = {
    tabs: { padding: "0", border: "0" },
    tabItem: { border: "0" },
    activeTabItem: {
      border: "0",
      textDecoration: "underline",
      textDecorationThickness: "2px",
      textUnderlineOffset: "0.1rem",
    },
  };

  const filter = new ObservableValue("");

  const loadNodes = (
    observable: ObservableValue<ISearchListItemGroup[]>,
    overrideCollection = true
  ) => {
    api.flow.getPlatformList(
      {
        success: (response) => {
          const items = response.map<ISearchListItemGroup>((platform) => ({
            id: platform.id,
            name: platform.name,
            items: platform.nodes.map<ISearchListItem>((node) => ({
              id: node.id,
              name: node.name,
              onAddAction: onAddNode,
            })),
          }));

          observable.value = overrideCollection
            ? items
            : observable.value.concat(items);
        },
      },
      filter.value
    );
  };

  const loadFlows = (
    observable: ObservableValue<ISearchListItemGroup[]>,
    overrideCollection = true
  ) => {
    api.flow.getAllFlawsAsTasks(
      {
        success: (response) => {
          const items = response.map<ISearchListItemGroup>((flowsType) => ({
            id: flowsType.id,
            name: flowsType.name,
            items: flowsType.flows.map<ISearchListItem>((flow) => ({
              id: flow.id,
              name: flow.name,
              onAddAction: onAddFlow,
            })),
          }));

          observable.value = overrideCollection
          ? items
          : observable.value.concat(items);
        },
      },
      filter.value
    );
  };

  const renderItems = (items: ISearchListItemGroup[]) => {
    if (!items) return;

    return (
      <div className="d-flex flex-column align-items-start">
        {items
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((group) => (
            <dl className="w-100" key={`group-${group.name}-${group.id}`}>
              <dt className="text-center">{group.name}</dt>
              <div className="d-flex flex-column align-items-start">
                {group.items
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <Button
                      className="text-capitalize mt-2 ml-2"
                      key={`item-${item.name}=${item.id}`}
                      size="sm"
                      onClick={() =>
                        item.onAddAction && item.onAddAction(item.id)
                      }
                    >
                      {item.name}
                    </Button>
                  ))}
              </div>
            </dl>
          ))}
      </div>
    );
  };

  return (
    <div
      className={classNames("card search-panel", {
        expand: isExpanded,
      })}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div>
        <SearchInput
          id="search"
          placeholder="Serach flow or node"
          bsSize="sm"
          onMouseDown={onMouseDown}
          onSearch={(value) => {
            if (filter.value !== value) filter.value = value;
          }}
        />
      </div>
      <Label
        for="search"
        className={classNames("mb-0 search-panel-items", {
          expand: isExpanded,
        })}
      >
        <Observer filter={filter}>
          {(observer: { filter: string }) =>
            (isExpanded && (
              <Tabs
                style={styles.tabs}
                tabStyle={styles.tabItem}
                activeTabStyle={styles.activeTabItem}
                contentClassName="search-items-content"
              >
                <Tab tabId="all" header="All">
                  <Provider onLoad={loadNodes} default={[]}>
                    {(provider) => renderItems(provider)}
                  </Provider>
                  <Provider onLoad={loadFlows} default={[]}>
                    {(provider) => renderItems(provider)}
                  </Provider>
                </Tab>
                <Tab tabId="flows" header="Flows">
                  <Provider onLoad={loadFlows} default={[]}>
                    {(provider) => renderItems(provider)}
                  </Provider>
                </Tab>
                <Tab tabId="nodes" header="Nodes">
                  <Provider onLoad={loadNodes} default={[]}>
                    {(provider) => renderItems(provider)}
                  </Provider>
                </Tab>
              </Tabs>
            )) || <div></div>
          }
        </Observer>
      </Label>
    </div>
  );
}
