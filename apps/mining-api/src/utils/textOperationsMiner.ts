import { ScrapData } from "domain/entities";
import {
  FieldOperationType,
  MiningFieldOperation,
  ExtractOperation,
  ReplaceOperation,
  RemoveOperation,
} from "../interfaces/MiningFieldOperation";

const searchOperation = (text: string, operation: ExtractOperation): string => {
  // get substring between initialString and final String
  const { initialString, finalString } = operation;
  const initialIndex = text.indexOf(initialString) + initialString.length;
  const finalIndex = text.indexOf(finalString, initialIndex);

  if (text.indexOf(initialString) === -1 || text.indexOf(finalString) === -1) {
    return "";
  }

  const result = text.substring(initialIndex, finalIndex).trim();
  return result;
};

const replaceOperation = (
  text: string,
  operation: ReplaceOperation
): string => {
  const { initialString, finalString } = operation;
  const result = text.replace(initialString, finalString);
  return result;
};

const removeOperation = (text: string, operation: RemoveOperation) => {
  const { initialString, numberOfLines } = operation;
  const initialIndex = text.indexOf(initialString);

  // get index of \n numberOfLines times
  let finalIndex = initialIndex;
  for (let i = 0; i < numberOfLines; i++) {
    finalIndex = text.indexOf("\n", finalIndex + 1);
  }

  // remove substring between initialIndex and finalIndex
  const result = text.substring(0, initialIndex) + text.substring(finalIndex);
  return result;
};

const textOperationMiner = (
  text: string,
  fieldOperations: MiningFieldOperation[]
): ScrapData => {
  let currentText = text;
  const values = fieldOperations.reduce((acc, fieldOperation) => {
    const { fieldName, operations } = fieldOperation;
    let fieldText = currentText;
    let value = "";

    operations.forEach((operation) => {
      if (operation.type === FieldOperationType.EXTRACT) {
        value = searchOperation(fieldText, operation);
        return;
      }
      if (operation.type === FieldOperationType.REPLACE) {
        fieldText = replaceOperation(fieldText, operation);
        return;
      }
      if (operation.type === FieldOperationType.REMOVE) {
        fieldText = removeOperation(fieldText, operation);
      }
    });

    currentText = fieldText;
    return {
      ...acc,
      [fieldName]: value,
    };
  }, {} as { [key: string]: string });

  return values as unknown as ScrapData;
};

export default textOperationMiner;
