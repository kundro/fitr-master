import axios, { AxiosResponse } from "axios";
import { IPagedModel } from "./models/base";
import { IFlowListItemModel } from "./models/flow";
import { IFlowInputModel } from "./models/input/flowInput";
import {
  IPlatformInputModel,
  IPlatformNodeInputModel,
  IPlatformNodePinInputModel,
} from "./models/input/platformInput";
import {
  IFlowNodeOutputModel,
  IFlowOutputModel,
  IFlowPlatformListItemOutputModel,
  IFlowsAsTasksListItemOutputModel,
} from "./models/output/flowOutput";
import {
  IPlatformOutputModel,
  IPlatformListItemOutputModel,
  IPlatformNodeListItemOutputModel,
  IPlatformNodeOutputModel,
  IPlatformNodePinOutputModel,
  IPlatformNodePinListItemOutputModel,
} from "./models/output/platformOutput";
import { IRunFlowModel, IRunFlowNodeModel } from "./models/output/run";
import { IRunFlowListItemModel, IRunNodeListItemModel } from "./models/run";

const headers = {
  //   Authorization: "",
  Accept: "application/json",
  "Cache-Control": "no-cache",
};

const http = axios.create({
  baseURL: "https://localhost:44300/",
  timeout: 150000,
  headers: headers,
});

function map<T>(
  response: IPromiseResponse<T>,
  promise: Promise<AxiosResponse<IResponse<T>>>
) {
  promise
    .then(({ data }) => {
      if (data?.isSuccess) {
        if (response.success) response.success(data.result);
      } else {
        const errors = data.errors || [];
        if (response.error) response.error(errors);

        if (errors.length > 0) {
          errors.forEach((x) => alert("Danger:" + x.message));
        } else {
          alert("Success");
        }
      }
    })
    .catch((reason) => {
      if (response.error)
        response.error([{ code: "Api", message: reason.message }]);

      alert("Danger:" + reason.message);
    })
    .finally(() => {
      if (response.finally) response.finally();
    });
}

const api = {
  platform: {
    get: (id: number, response: IPromiseResponse<IPlatformOutputModel>) => {
      map(
        response,
        http.get<IResponse<IPlatformOutputModel>>(`/platforms/${id}`, {})
      );
    },
    getAll: (
      response: IPromiseResponse<IPagedModel<IPlatformListItemOutputModel>>,
      options?: IFilterOption
    ) => {
      map(
        response,
        http.get<IResponse<IPagedModel<IPlatformListItemOutputModel>>>(
          "/platforms",
          {
            params: options,
          }
        )
      );
    },
    post: (model: IPlatformInputModel, response: IPromiseResponse<number>) => {
      map(response, http.post<IResponse<number>>("/platforms", model));
    },
    put: (model: IPlatformInputModel, response: IPromiseResponse<void>) => {
      map(response, http.put<IResponse<void>>("/platforms", model));
    },
    delete: (id: number, response: IPromiseResponse<void>) => {
      map(response, http.delete<IResponse<void>>(`/platforms/${id}`));
    },
  },
  platformNode: {
    get: (id: number, response: IPromiseResponse<IPlatformNodeOutputModel>) => {
      map(
        response,
        http.get<IResponse<IPlatformNodeOutputModel>>(
          `/platforms/nodes/${id}`,
          {}
        )
      );
    },
    getAll: (
      platformId: number,
      response: IPromiseResponse<IPagedModel<IPlatformNodeListItemOutputModel>>,
      options?: IFilterOption
    ) => {
      map(
        response,
        http.get<IResponse<IPagedModel<IPlatformNodeListItemOutputModel>>>(
          `/platforms/${platformId}/nodes`,
          {
            params: options,
          }
        )
      );
    },
    post: (
      model: IPlatformNodeInputModel,
      response: IPromiseResponse<number>
    ) => {
      map(response, http.post<IResponse<number>>("/platforms/nodes", model));
    },
    put: (model: IPlatformNodeInputModel, response: IPromiseResponse<void>) => {
      map(response, http.put<IResponse<void>>("/platforms/nodes", model));
    },
    delete: (id: number, response: IPromiseResponse<void>) => {
      map(response, http.delete<IResponse<void>>(`/platforms/nodes/${id}`));
    },
  },
  platformNodePin: {
    get: (
      id: number,
      response: IPromiseResponse<IPlatformNodePinOutputModel>
    ) => {
      map(
        response,
        http.get<IResponse<IPlatformNodePinOutputModel>>(
          `/platforms/nodes/pins/${id}`,
          {}
        )
      );
    },
    getAll: (
      nodeId: number,
      response: IPromiseResponse<
        IPagedModel<IPlatformNodePinListItemOutputModel>
      >,
      options?: IFilterOption
    ) => {
      map(
        response,
        http.get<IResponse<IPagedModel<IPlatformNodePinListItemOutputModel>>>(
          `/platforms/nodes/${nodeId}/pins`,
          {
            params: options,
          }
        )
      );
    },
    post: (
      model: IPlatformNodePinInputModel,
      response: IPromiseResponse<number>
    ) => {
      map(
        response,
        http.post<IResponse<number>>("/platforms/nodes/pins", model)
      );
    },
    put: (
      model: IPlatformNodePinInputModel,
      response: IPromiseResponse<void>
    ) => {
      map(response, http.put<IResponse<void>>("/platforms/nodes/pins", model));
    },
    delete: (id: number, response: IPromiseResponse<void>) => {
      map(
        response,
        http.delete<IResponse<void>>(`/platforms/nodes/pins/${id}`)
      );
    },
  },
  flow: {
    get: (id: number, response: IPromiseResponse<IFlowOutputModel>) => {
      map(response, http.get<IResponse<IFlowOutputModel>>(`/flows/${id}`, {}));
    },
    getTemplate: (id: number, response: IPromiseResponse<IFlowOutputModel>) => {
      map(
        response,
        http.get<IResponse<IFlowOutputModel>>(`/flows/template`, {})
      );
    },
    getAll: (
      response: IPromiseResponse<IPagedModel<IFlowListItemModel>>,
      options?: IFilterOption
    ) => {
      map(
        response,
        http.get<IResponse<IPagedModel<IFlowListItemModel>>>("/flows", {
          params: options,
        })
      );
    },
    getAllFlawsAsTasks: (
      response: IPromiseResponse<IFlowsAsTasksListItemOutputModel[]>,
      filter: string
    ) => {
      map(
        response,
        http.get<IResponse<IFlowsAsTasksListItemOutputModel[]>>(
          "/flows/flowsAsTasks",
          {
            params: { filter: filter },
          }
        )
      );
    },
    getPlatformList: (
      response: IPromiseResponse<IFlowPlatformListItemOutputModel[]>,
      filter: string
    ) => {
      map(
        response,
        http.get<IResponse<IFlowPlatformListItemOutputModel[]>>(
          "/flows/platforms/list",
          {
            params: { filter: filter },
          }
        )
      );
    },
    post: (model: IFlowInputModel, response: IPromiseResponse<number>) => {
      map(response, http.post<IResponse<number>>("/flows", model));
    },
    put: (model: IFlowInputModel, response: IPromiseResponse<void>) => {
      map(response, http.put<IResponse<void>>("/flows", model));
    },
    delete: (id: number, response: IPromiseResponse<void>) => {
      map(response, http.delete<IResponse<void>>(`/flows/${id}`));
    },
  },
  flowNode: {
    get: (id: number, response: IPromiseResponse<IFlowNodeOutputModel>) => {
      map(
        response,
        http.get<IResponse<IFlowNodeOutputModel>>(`/flows/nodes/${id}`, {})
      );
    },
  },
  runFlow: {
    get: (id: number, response: IPromiseResponse<IRunFlowModel>) => {
      map(response, http.get(`/run/flows/${id}`, {}));
    },
    getAll: (
      response: IPromiseResponse<IPagedModel<IRunFlowListItemModel>>,
      options?: IFilterOption
    ) => {
      map(
        response,
        http.get("/run/flows", {
          params: options,
        })
      );
    },
  },
  runNode: {
    get: (id: number, response: IPromiseResponse<IRunFlowNodeModel>) => {
      map(response, http.get(`/run/nodes/${id}`, {}));
    },
    getAll: (
      response: IPromiseResponse<IPagedModel<IRunNodeListItemModel>>,
      options?: IFilterOption
    ) => {
      map(
        response,
        http.get("/run/nodes", {
          params: options,
        })
      );
    },
  },
};

export default api;

export interface IFilterOption {
  filter?: string;
  skip: number;
  take: number;
}

export interface IResponse<T> {
  result: T;
  isSuccess: boolean;
  errors: IResponseError[];
}

export interface IPromiseResponse<T> {
  success?: (response: T) => void;
  error?: (errors: IResponseError[]) => void;
  finally?: () => void;
}

export interface IResponseError {
  message: string;
  code: string;
}
