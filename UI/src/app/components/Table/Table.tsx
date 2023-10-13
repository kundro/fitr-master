import React, { useState, useEffect, useRef } from "react";
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import newGuid from "../../../utils/guid";
import { IPagedModel } from "../../models/base";
import { ITableProps } from "./props";
import SearchBox from "./SearchBox";
import { IFilterOption } from "../../api";
import { Col, Row } from "reactstrap/lib";
import LoadingBar from "react-top-loading-bar";
import "./Table.scss";

export default function Table<T>({
  header,
  title,
  children,
  api,
  display,
}: ITableProps<T>) {
  const canSearch: boolean = children.some((x) => x.props.search);

  const [data, setData] = useState<IPagedModel<T>>({
    items: [],
    count: 0,
  });
  const [filterOptions, setFilterOptions] = useState<IFilterOption>({
    filter: "",
    skip: 0,
    take: 10,
  });
  const loadingBarRef = useRef<any>(null);

  useEffect(() => {
    loadingBarRef.current.continuousStart(10, 500);

    api(
      {
        success: (data) => {
          setData(data);
        },
        error: (errors) => {
          setData({
            items: [],
            count: 0,
          });
        },
        finally: () => {
          loadingBarRef.current.complete();
        },
      },
      filterOptions
    );
  }, [api, filterOptions]);

  const pages = {
    current: (offset?: number) =>
      Math.trunc(filterOptions.skip / filterOptions.take) + (offset || 0),
    count: (offset?: number) =>
      Math.trunc(data.count / filterOptions.take) + 1 + (offset || 0),
  };
  const updateFilterOptions = (options: IFilterOption) => {
    if (
      options.filter !== filterOptions.filter ||
      options.skip !== filterOptions.skip ||
      options.take !== filterOptions.take
    ) {
      setFilterOptions({
        filter:
          options.filter !== undefined ? options.filter : filterOptions.filter,
        skip: options.skip !== undefined ? options.skip : filterOptions.skip,
        take: options.take !== undefined ? options.take : filterOptions.take,
      });
    }
  };

  const onSearch = (value: string) => {
    updateFilterOptions({
      filter: value,
      skip: filterOptions.skip,
      take: filterOptions.take,
    });
  };

  const onTakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilterOptions({
      filter: filterOptions.filter,
      skip: 0,
      take: +event.target.value,
    });
  };

  const onPageChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    page: number
  ) => {
    updateFilterOptions({
      filter: filterOptions.filter,
      skip: page * filterOptions.take,
      take: filterOptions.take,
    });
    event.preventDefault();
  };

  return (
    <>
      <div className={display !== "inner" ? "card" : ""}>
        {!!header && display !== "inner" && (
          <h6 className="card-header">{header}</h6>
        )}
        <LoadingBar
          className="loader"
          color="#5e72e4"
          height={2}
          loaderSpeed={500}
          shadow={false}
          ref={loadingBarRef}
        />
        <div className="card-body">
          <Row>
            <Col lg="4" md="5" sm="6">
              {canSearch && <SearchBox onSearch={onSearch} />}
            </Col>
            <Col className="text-right">{title}</Col>
          </Row>
        </div>
        <div className="table-responsive">
          <table className="align-items-center table-flush table">
            <thead className="thead-light">
              <tr>
                {children.map((x) => (
                  <th key={newGuid()}>{x.props.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="list">
              {data.items.map((row) => (
                <tr key={newGuid()}>
                  {children.map((col) => (
                    <td key={newGuid()}>
                      {col.props.children ||
                        (col.props.render && col.props.render(row))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!data.count && (
          <div className="d-flex justify-content-center">
            <label className="m-3">No data</label>
          </div>
        )}
        {!!data.count && (
          <div className="border-0 card-footer d-flex justify-content-between">
            <Pagination size="sm">
              <PaginationItem>
                <PaginationLink
                  disabled={pages.current() === 0}
                  onClick={(e) => onPageChange(e, 0)}
                >
                  <i className="fa fa-angle-double-left" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  disabled={pages.current() === 0}
                  onClick={(e) => onPageChange(e, pages.current(-1))}
                >
                  <i className="fa fa-angle-left" />
                </PaginationLink>
              </PaginationItem>

              {Array.from(Array(pages.count()).keys())
                .filter(
                  (page) =>
                    (pages.current() < 3 && page < 5) ||
                    (pages.current() >= 3 &&
                      pages.current() < pages.count(-3) &&
                      page < pages.current(3) &&
                      page > pages.current(-3)) ||
                    (pages.current() >= pages.count(-3) &&
                      page >= pages.count(-5))
                )
                .map((page) => (
                  <PaginationItem
                    key={newGuid()}
                    onClick={(e) => onPageChange(e, page)}
                    className={page === pages.current() ? "active" : ""}
                  >
                    <PaginationLink className="pagination-page">
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationLink
                  disabled={pages.current() === pages.count(-1)}
                  onClick={(e) => onPageChange(e, pages.current(1))}
                >
                  <i className="fa fa-angle-right" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  disabled={pages.current() === pages.count(-1)}
                  onClick={(e) => onPageChange(e, pages.count(-1))}
                >
                  <i className="fa fa-angle-double-right" />
                </PaginationLink>
              </PaginationItem>
            </Pagination>

            <label>
              <Input
                className="focus-primary"
                type="select"
                bsSize="sm"
                value={filterOptions.take}
                onChange={onTakeChange}
                style={{ display: "inline-block", width: "auto" }}
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </Input>
              &nbsp;Displaying {filterOptions.skip + 1} -{" "}
              {Math.min(filterOptions.skip + filterOptions.take, data.count)} of{" "}
              {data.count}
            </label>
          </div>
        )}
      </div>
    </>
  );
}
