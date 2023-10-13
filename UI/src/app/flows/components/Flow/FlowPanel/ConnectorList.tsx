import {
  ArrayObserver,
  ObservableArray,
} from "../../../../../utils/observable";
import { IPosition } from "../../../../models/common";
import { IConnectorObservable } from "../../../Flow";

export interface IConnectorListProps {
  connectors: ObservableArray<IConnectorObservable>;
  flowPosition: IPosition;
  selectedConnector?: IConnectorObservable;
  onConnectorSelect?: (connector: IConnectorObservable) => void;
}

const getPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  size: number
) => {
  startX += size / 2;
  startY += size / 2;
  endX += size / 2;
  endY += size / 2;

  const absX = endX - startX;
  const absY = endY - startY;
  const sizeSqrt = size / Math.SQRT2;

  const kx = endY > startY ? 1 : -1;
  const ky = endX > startX ? -1 : 1;

  return `M${startX},${startY} q${absX / 4},${0} ${absX / 2},${
    absY / 2
  } T${endX},${endY} l${kx * sizeSqrt},${ky * size} q${-absX / 4},${0} ${
    -absX / 2
  },${-absY / 2} T${startX},${startY + ky * size} Z`;
};

const getPinIcon = (key: string) => {
  return document.querySelector(`div[id="${key}"] i`);
};

const getPosition = (rect: DOMRect): IPosition => {
  return {
    x: +(rect.left + rect.width / 2),
    y: +(rect.top + rect.height / 2),
  };
};

export default function ConnectorList({
  connectors,
  flowPosition,
  selectedConnector,
  onConnectorSelect,
}: IConnectorListProps): JSX.Element {
  const renderConnector = (connector: IConnectorObservable) => {
    const startRect = getPinIcon(
      connector.startPin.model.key
    )?.getBoundingClientRect();
    const endRect = getPinIcon(
      connector.endPin.model.key
    )?.getBoundingClientRect();

    if (!startRect || !endRect) return undefined;

    const start = getPosition(startRect);
    const end = getPosition(endRect);

    return (
      <path
        className={
          selectedConnector === connector
            ? "connector-selected"
            : `pin-color pin-color-${connector.startPin.model.valueType}`
        }
        key={connector.key}
        d={getPath(
          start.x - flowPosition.x,
          start.y - flowPosition.y,
          end.x - flowPosition.x,
          end.y - flowPosition.y,
          2
        )}
        onMouseDown={() => onConnectorSelect && onConnectorSelect(connector)}
      />
    );
  };

  return (
    <ArrayObserver observable={connectors} renderItem={renderConnector}>
      {(items, renderItems) => (
        <svg
          className="connectors-panel overflow-visible"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {renderItems()}
        </svg>
      )}
    </ArrayObserver>
  );
}
