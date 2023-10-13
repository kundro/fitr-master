import { IFilterOption, IPromiseResponse } from "../../api";
import { IPagedModel } from "../../models/base";

export interface ITableProps<TModel> {
  header?: string;
  title?: React.ReactNode;
  display?: "outer" | "inner";
  children: React.ReactElement<IColumnProps<TModel>>[];
  api: (
    response: IPromiseResponse<IPagedModel<TModel>>,
    options?: IFilterOption
  ) => void;
}

export interface IColumnProps<TModel> {
  header?: string;
  render?: (props: TModel) => React.ReactNode;
  children?: ((props: TModel) => React.ReactNode) | React.ReactNode;
  search?: boolean;
}

export interface ISearchBoxProps {
  disabled?: boolean;
  onSearch?: (value: string) => void;
}
