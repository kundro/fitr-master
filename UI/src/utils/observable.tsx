import React, { useState } from "react";
import newGuid from "./guid";
import * as RS from "reactstrap";

export function useObservable<T>(value: T) {
  const [observable] = useState(new ObservableValue(value));
  return observable;
}

export class ObservableValue<T> {
  private _value: T;
  private _callbacks: { [key: string]: () => void };

  constructor(value: T) {
    this._value = value;
    this._callbacks = {};
  }

  public set value(value: T) {
    this._value = value;
    this.notify();
  }

  public get value() {
    return this._value;
  }

  public subscribe(action: string, callback: () => void) {
    this._callbacks[action] = callback;
  }

  public unsubscribe(key: string) {
    delete this._callbacks[key];
  }

  public unsubscribeAll() {
    this._callbacks = {};
  }

  public notify() {
    for (const [, callback] of Object.entries(this._callbacks)) {
      callback();
    }
  }
}

export class ObservableArray<T> extends ObservableValue<ObservableValue<T>[]> {}

export class Observer extends React.Component<
  { [propName: string]: ObservableValue<any> | any },
  { [propName: string]: ObservableValue<any> }
> {
  private guid: string = newGuid();

  render(): JSX.Element {
    const childProps: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(this.props)) {
      if (["key", "children"].includes(key)) {
      } else if (value instanceof ObservableValue) {
        childProps[key] = value.value;
        value.subscribe(this.guid, () => this.setState({ [key]: value }));
      } else {
        childProps[key] = value;
      }
    }

    if (typeof this.props.children === "function") {
      return this.props.children(childProps);
    }

    return <>{this.props.children}</>;
  }

  componentWillUnmount(): void {
    for (const [, value] of Object.entries(this.props)) {
      if (value instanceof ObservableValue) {
        value.unsubscribe(this.guid);
      }
    }
  }
}

export function Provider<T>(props: {
  onLoad: (observable: ObservableValue<T>) => void;
  children: (props: T) => React.ReactNode;
  default: T;
}): JSX.Element {
  const observable = useObservable(props.default);

  props.onLoad(observable);

  return (
    <Observer observable={observable}>
      {(observer: { observable: T }) => props.children(observer.observable)}
    </Observer>
  );
}

export function ArrayObserver<T>(props: {
  observable: ObservableArray<T>;
  renderItem: (item: T) => React.ReactNode;
  children: (
    items: ObservableValue<T>[],
    renderItems: () => React.ReactNode
  ) => React.ReactNode;
}): JSX.Element {
  return (
    <Observer observable={props.observable}>
      {(observer: { observable: ObservableValue<T>[] }) => {
        return props.children(observer.observable, () => {
          return observer.observable.map((item) => (
            <Observer key={newGuid()} item={item}>
              {(itemObserver: { item: T }) =>
                props.renderItem(itemObserver.item)
              }
            </Observer>
          ));
        });
      }}
    </Observer>
  );
}

export function Input(
  props: RS.InputProps | { observable?: ObservableValue<string> }
): JSX.Element {
  return (
    <Observer observable={props.observable}>
      {(observer: { observable?: string }) => (
        <RS.Input value={observer.observable} {...(props as RS.InputProps)} />
      )}
    </Observer>
  );
}

export function Checkbox(
  props: RS.InputProps | { observable?: ObservableValue<boolean> }
): JSX.Element {
  return (
    <Observer observable={props.observable}>
      {(observer: { observable?: boolean }) => (
        <RS.Input
          type="checkbox"
          checked={observer.observable}
          {...(props as RS.InputProps)}
        />
      )}
    </Observer>
  );
}
