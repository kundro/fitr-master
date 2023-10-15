import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Form } from "reactstrap";
import { useHistory } from "react-router-dom";
import { IPromiseResponse } from "../../api";
import LoadingBar from "react-top-loading-bar";
import "./../../../assets/scss/loader.scss";
import Tab from "../Tabs/Tab";
import Tabs, { ITabsProps } from "../Tabs/Tabs";
import classnames from "classnames";

interface IFormModelProps<TInputModel, TOutputModel> {
  header: string;
  className?: string;
  isNew?: boolean;
  footer?: React.ReactNode;
  tabs?: React.ReactElement<ITabsProps>;
  hrefBack: string;
  default: TInputModel;
  api: (response: IPromiseResponse<TOutputModel>) => void;
  apiMapper: (model: TOutputModel) => TInputModel;
  children: (
    model: TInputModel,
    disabled: boolean,
    handleChange: (
      e: React.ChangeEvent<HTMLInputElement>,
      map?: (
        e: React.ChangeEvent<HTMLInputElement>
      ) => string | number | boolean
    ) => void
  ) => React.ReactNode;
  onSubmit: (model: TInputModel, loader: IFormLoader) => void;
  onSaveAsNew?: (model: TInputModel, loader: IFormLoader) => void;
  onDelete?: (model: TInputModel, loader: IFormLoader) => void;
}

export interface IFormLoader {
  start: () => void;
  complete: () => void;
}

export default function FormModel<TInputModel, TOutputModel>(
  props: IFormModelProps<TInputModel, TOutputModel>
) {
  const history = useHistory();
  const [state, setState] = useState(props.default);
  const [disabled, setDisabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const loadingBarRef = useRef<any>(null);
  const tabs = !!props.tabs
    ? Array.isArray(props.tabs.props.children)
      ? props.tabs.props.children
      : [props.tabs.props.children]
    : [];

  const [loader] = useState<IFormLoader>({
    start: () => {
      loadingBarRef?.current?.continuousStart(10, 500);
      setDisabled(true);
    },
    complete: () => {
      loadingBarRef?.current?.complete();
      setDisabled(false);
    },
  });

  useEffect(() => {
    if (!props.isNew) {
      loader.start();

      props.api({
        success: (data) => {
          setState(props.apiMapper(data));
        },
        error: (errors) => {
          setState(props.default);
        },
        finally: () => {
          loader.complete();
        },
      });
    }
  }, [props, loader]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    map?: (e: React.ChangeEvent<HTMLInputElement>) => string | number | boolean
  ) => {
    const { value, name } = e.target;

    setHasChanges(true);

    setState({
      ...state,
      [name]: map ? map(e) : value,
    });
  };

  const onSubmit = () => {
    setHasChanges(false);
    props.onSubmit(state, loader);
  };

  const onSaveAsNew = () => {
    setHasChanges(false);
    props.onSaveAsNew && props.onSaveAsNew(state, loader);
  };

  function renderDefinition() {
    return (
      <>
        <LoadingBar
          className="loader"
          color="#5e72e4"
          height={2}
          loaderSpeed={500}
          shadow={false}
          ref={loadingBarRef}
        />
        <div className="card-body">
          <Form>{props.children(state, disabled, handleChange)}</Form>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <div>
            {!props.isNew && (
              <Button
                className="text-danger"
                size="sm"
                color="link"
                disabled={disabled}
                onClick={(e) => props.onDelete && props.onDelete(state, loader)}
              >
                Delete
              </Button>
            )}
          </div>
          <div>
            <Button
              size="sm"
              color="outline-primary"
              disabled={disabled}
              onClick={() => history.push(props.hrefBack)}
            >
              {hasChanges ? "Cancel" : "Close"}
            </Button>
            <Button
              size="sm"
              color="primary"
              disabled={!hasChanges || disabled}
              onClick={onSubmit}
            >
              {props.isNew ? "Save" : "Update"}
            </Button>
            {!props.isNew && props.onSaveAsNew && (
              <Button size="sm" color="success" onClick={onSaveAsNew}>
                Save as new
              </Button>
            )}
            {props.footer}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Card className={props.className}>
        <h6
          className={
            "card-header " +
            classnames({
              "border-0": tabs.some((x) => !!x),
            })
          }
        >
          {props.header}
        </h6>
        {(!!props.tabs && (
          <Tabs>
            {[
              <Tab tabId="definition" header="Definition">
                {renderDefinition()}
              </Tab>,
              ...tabs,
            ]}
          </Tabs>
        )) ||
          renderDefinition()}
      </Card>
    </>
  );
}
