type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  mapValue?: {
    fields: {
      [key: string]: FirestoreValue;
    };
  };
};

export type FirestoreDocument = {
  createTime?: string;
  updateTime?: string;
  name?: string;
  fields: { [key: string]: FirestoreValue };
};

export type EmptyObject = Record<string, never>;

export type FirestoreEvent = {
  value: FirestoreDocument | EmptyObject;
  oldValue: FirestoreDocument | EmptyObject;
  updateMask:
    | {
        fieldPaths: string[];
      }
    | EmptyObject;
};

export type EventContext<T> = {
  eventId: string;
  eventType: string;
  timestamp: string;
  notSupported: unknown;
  resource: string;
  params: T;
};

export type OperationType = "IMPORT" | "INSERT" | "UPDATE" | "DELETE";
