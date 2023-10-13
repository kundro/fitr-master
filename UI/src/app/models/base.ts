export interface IPagedModel<TModel> {
  items: TModel[];
  count: number;
}

export interface INamedModel {
  id: number;
  name: string;
}
