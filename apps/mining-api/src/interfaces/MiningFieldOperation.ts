export enum FieldOperationType {
  REPLACE = "replace",
  REMOVE = "remove",
  EXTRACT = "extract",
}

export interface ExtractOperation {
  type: FieldOperationType.EXTRACT;
  initialString: string;
  finalString: string;
}

export interface ReplaceOperation {
  type: FieldOperationType.REPLACE;
  initialString: string;
  finalString: string;
}

export interface RemoveOperation {
  type: FieldOperationType.REMOVE;
  initialString: string;
  numberOfLines: number;
}

export type FieldOperation =
  | ExtractOperation
  | ReplaceOperation
  | RemoveOperation;

export interface MiningFieldOperation {
  fieldName: string;
  operations: FieldOperation[];
}
