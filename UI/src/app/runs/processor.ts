import { camelize } from "../../utils/camelize";
import { NodeCommandType, PinValueType } from "../models/enums";
import { IRunFlowNodeModel } from "../models/output/run";

export interface ICommandParameter {
  name: string;
  value: string;
  valueType: PinValueType;
}

export function processCommand(
  command: string,
  parameters: ICommandParameter[],
  context?: object
): ICommandParameter[] {
  return commands[command]
    ? commands[command](
        parameters.filter((x) => x.valueType !== PinValueType.Node),
        context
      )
    : [];
}

export function canProcessNode(node: IRunFlowNodeModel) {
  return (
    node &&
    !node.processed &&
    !node.inputPins.some(
      (x) => !!x.parentPin && !!x.parentPin.node && !x.parentPin.node.processed
    )
  );
}

export const hasActivePins = (node: IRunFlowNodeModel) => {
  return node.inputPins.some(
    (x) => x.valueType !== PinValueType.Node && !x.parentPin && x.isPublic
  );
};

//#region Processors
export const preprocessNode = (node: IRunFlowNodeModel) => {
  node.inputPins
    .filter((x) => !!x.parentPin)
    .forEach((x) => (x.value = x.parentPin!.value));
};

export const processNode = (node: IRunFlowNodeModel, context?: object) => {
  switch (node.commandType) {
    case NodeCommandType.Command:
      processCommandNode(node, context);
      break;
    case NodeCommandType.Page:
      processPageNode(node, context);
      break;
  }
};

export const processWhilePossible = (
  current: IRunFlowNodeModel,
  nodes: IRunFlowNodeModel[],
  ignoreActivePins = false
): IRunFlowNodeModel | undefined => {
  let prev: IRunFlowNodeModel | undefined = undefined;

  while (true) {
    const node = nodes.find((x) => canProcessNode(x));

    if (prev === node || !node) break;

    if (
      node !== current &&
      ((!ignoreActivePins && hasActivePins(node)) ||
        node.commandType === NodeCommandType.Page)
    )
      return node;

    preprocessNode(node);
    processNode(node);
    prev = node;
  }

  return prev;
};

export const processCommandNode = (
  node: IRunFlowNodeModel,
  context?: object
) => {
  if (node.commandType !== NodeCommandType.Command) return;

  const res = processCommand(
    node.command,
    node.inputPins.map((x) => ({
      name: x.name,
      valueType: x.valueType,
      value: x.value ?? "",
    })),
    context
  );

  node.outputPins.forEach((pin) => {
    const resValue = res.find(
      (x) =>
        x.valueType === pin.valueType && camelize(x.name) === camelize(pin.name)
    );

    if (resValue) pin.value = resValue.value;
  });

  node.processed = true;
};

export const processPageNode = (node: IRunFlowNodeModel, context?: object) => {
  if (node.commandType !== NodeCommandType.Page || !context) return;

  const res = Object.entries(context)
    .map<ICommandParameter | undefined>(([key, value]) => {
      let param: ICommandParameter | undefined = undefined;

      switch (typeof value) {
        case "boolean":
          param = getBoolParameter(key, value);
          break;
        case "string":
          param = getTextParameter(key, value);

          break;
        case "number":
          param = getNumberParameter(key, value);

          break;
      }

      return param;
    })
    .filter((x) => x !== undefined);

  node.outputPins.forEach((pin) => {
    const resValue = res.find(
      (x) =>
        x!.valueType === pin.valueType &&
        camelize(x!.name) === camelize(pin.name)
    );

    if (resValue) pin.value = resValue.value;
  });

  node.processed = true;
};

//#endregion

//#region Get Values
const getBoolValue = (
  key: string,
  parameters: ICommandParameter[]
): boolean => {
  const parameter = parameters.find(
    (x) =>
      camelize(x.name) === camelize(key) && x.valueType === PinValueType.Bool
  );

  const value = camelize(parameter?.value ?? "");

  return value === "true" ? true : value === "false" ? false : false;
};

const getTextValue = (key: string, parameters: ICommandParameter[]): string => {
  const parameter = parameters.find(
    (x) =>
      camelize(x.name) === camelize(key) && x.valueType === PinValueType.String
  );

  return parameter?.value ?? "";
};

const getNumberValue = (
  key: string,
  parameters: ICommandParameter[]
): number => {
  const parameter = parameters.find(
    (x) =>
      camelize(x.name) === camelize(key) && x.valueType === PinValueType.Number
  );

  return parameter ? +parameter.value : 0;
};

export const getObjectFromValues = (
  parameters: ICommandParameter[]
): object => {
  const res: { [key: string]: any } = {};

  parameters.forEach((x) => {
    let value: any = undefined;

    switch (x.valueType) {
      case PinValueType.Bool:
        value = getBoolValue(x.name, [x]);
        break;
      case PinValueType.String:
        value = getTextValue(x.name, [x]);
        break;
      case PinValueType.Number:
        value = getNumberValue(x.name, [x]);
        break;
    }

    res[camelize(x.name)] = value;
  });

  return res;
};
//#endregion

//#region Get Parameters
const getBoolParameter = (key: string, value: boolean): ICommandParameter => {
  const res = value ? "true" : "false";

  return { name: key, valueType: PinValueType.Bool, value: res };
};

const getTextParameter = (key: string, value: string): ICommandParameter => {
  return { name: key, valueType: PinValueType.String, value: value };
};

const getNumberParameter = (key: string, value: number): ICommandParameter => {
  return { name: key, valueType: PinValueType.Number, value: value.toString() };
};
//#endregion

const commands: {
  [key: string]: (
    parameters: ICommandParameter[],
    context?: object
  ) => ICommandParameter[];
} = {
  NOT: (parameters) => {
    return parameters
      .filter((x) => x.valueType === PinValueType.Bool)
      .map((x) => getBoolParameter(x.name, !getBoolValue(x.name, parameters)));
  },
  CONSOLE_LOG: (parameters, context) => {
    const msg = getTextValue("message", parameters);
    const ctx = getBoolValue("context", parameters);

    if (msg) console.log(msg);
    if (ctx) console.log(context);

    return [];
  },
  STR_EQUALS: (parameters) => {
    const a = getTextValue("a", parameters);
    const b = getTextValue("b", parameters);

    return [getBoolParameter("result", a === b)];
  },
  NUMBER_EQUALS: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getBoolParameter("result", a === b)];
  },
  MORE: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getBoolParameter("result", a > b)];
  },
  LESS: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getBoolParameter("result", a < b)];
  },
  SUM: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getNumberParameter("result", a + b)];
  },
  SUB: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getNumberParameter("result", a - b)];
  },
  DIVISION: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getNumberParameter("result", a / b)];
  },
  OR: (parameters) => {
    const a = getBoolValue("a", parameters);
    const b = getBoolValue("b", parameters);

    return [getBoolParameter("result", a || b)];
  },
  AND: (parameters) => {
    const a = getBoolValue("a", parameters);
    const b = getBoolValue("b", parameters);

    return [getBoolParameter("result", a && b)];
  },
  MUL: (parameters) => {
    const a = getNumberValue("a", parameters);
    const b = getNumberValue("b", parameters);

    return [getNumberParameter("result", a * b)];
  },
  CONCAT: (parameters) => {
    const a = getTextValue("a", parameters);
    const b = getTextValue("b", parameters);

    return [getTextParameter("result", a + b)];
  },
  MESSAGE: (parameters) => {
    const condition = getBoolValue("condition", parameters);
    const trueMessage = getTextValue("trueMessage", parameters);
    const falseMessage = getTextValue("falseMessage", parameters);

    return [getTextParameter("result", condition ? trueMessage : falseMessage)];
  },
};
