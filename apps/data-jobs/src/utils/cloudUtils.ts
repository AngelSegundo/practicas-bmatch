import { FirestoreDocument, FirestoreEvent, OperationType } from "../types";

export const getOperationType = (event: FirestoreEvent): OperationType => {
  if (event.value && Object.keys(event.value).length) {
    if (event.oldValue && Object.keys(event.oldValue).length) {
      return "UPDATE";
    }
    return "INSERT";
  }
  return "DELETE";
};

export const mapFirestoreDocumentToObject = (document: FirestoreDocument) => {
  const result: { [key: string]: unknown } = {};

  Object.keys(document.fields).forEach((key) => {
    const value = document.fields[key];
    if (value.stringValue) {
      result[key] = value.stringValue;
    } else if (value.integerValue) {
      result[key] = parseInt(value.integerValue, 10);
    } else if (value.doubleValue) {
      result[key] = value.doubleValue;
    } else if (value.booleanValue) {
      result[key] = value.booleanValue;
    } else if (value.mapValue) {
      result[key] = mapFirestoreDocumentToObject({
        fields: value.mapValue.fields,
      });
    }
  });
  return result;
};
