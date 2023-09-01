import {
  FieldOperationType,
  MiningFieldOperation,
} from "../interfaces/MiningFieldOperation";

export const ticketOps: MiningFieldOperation[] = [
  {
    fieldName: "ticket_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "N",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "counter_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Número de Medidor",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "pricing_plan",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Grupo Tarifario",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "client_route",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Ruta : ",
        finalString: "Consumo (M3) :",
      },
    ],
  },
  {
    fieldName: "fixed_price",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Cargo fijo = $",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "user_consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "CONSUMO TOTAL ",
        finalString: "m3",
      },
    ],
  },
  {
    fieldName: "consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "CONSUMO AGUA ",
        finalString: " ",
      },
    ],
  },
  {
    fieldName: "total_month",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "TOTAL VENTA",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "tax_amount",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "IVA",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "issued_date",
    operations: [
      {
        type: FieldOperationType.REPLACE,
        initialString: "FECHA EMISIÓN:",
        finalString: "\n",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Fecha de Emisión",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "due_date",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "VENCIMIENTO",
        finalString: "TOTAL",
      },
    ],
  },
  {
    fieldName: "total_amount",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "TOTAL A PAGAR $",
        finalString: "\n",
      },
    ],
  },
];

export const invoiceOps = [
  ...ticketOps,
  {
    fieldName: "client_name",
    operations: [
      {
        initialString: "SEÑOR (ES) :",
        finalString: "FECHA EMISIÓN",
      },
    ],
  },
  {
    fieldName: "client_id",
    operations: [
      {
        initialString: "Nº CLIENTE :",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "ticket_id",
    operations: [
      {
        initialString: "FACTURA ELECTRONICA",
        finalString: "BRISAGUAS SPA",
      },
    ],
  },
  {
    fieldName: "client_address",
    operations: [
      {
        initialString: "DIRECCIÓN :",
        finalString: "FECHA VCTO.",
      },
    ],
  },
  {
    fieldName: "client_comuna",
    operations: [
      {
        initialString: "COMUNA :",
        finalString: "LECTURA ANTERIOR :",
      },
    ],
  },
  {
    fieldName: "fixed_price",
    operations: [
      {
        initialString: "Cargo fijo $",
        finalString: "NETO",
      },
    ],
  },
];
