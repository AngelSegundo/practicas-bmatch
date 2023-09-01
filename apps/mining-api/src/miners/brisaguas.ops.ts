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
        initialString: "Giro: CAPTACIóN, DEPURACIóN Y DISTRIBUCIóN DE AGUA",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "client_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "No. Cliente :",
        finalString: "Rut",
      },
    ],
  },
  {
    fieldName: "client_name",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Nombre :",
        finalString: "Lectura Anterior",
      },
    ],
  },
  {
    fieldName: "client_address",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Dirección :",
        finalString: " Lectura Actual",
      },
    ],
  },
  {
    fieldName: "client_comuna",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Comuna :",
        finalString: "Ruta",
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
        initialString: "Cargo fijo $",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "user_consumption",
    operations: [
      {
        type: FieldOperationType.REPLACE,
        initialString: "CONSUMO :",
        finalString: "Consumo (M3) :",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Consumo (M3) :",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "current_price_adjustments",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Ajuste Sencillo Actual",
        finalString: "Total Mes",
      },
    ],
  },
  {
    fieldName: "previous_price_adjustments",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Ajuste Sencillo Anterior",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "total_month",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Total Mes $",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "tax_amount",
    operations: [
      {
        type: FieldOperationType.REPLACE,
        initialString: "/IVA Total",
        finalString: "",
      },
      {
        type: FieldOperationType.REPLACE,
        initialString: "IVA",
        finalString: "El iva de esta boleta es de $ ",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "El iva de esta boleta es de $ ",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "issued_date",
    operations: [
      {
        type: FieldOperationType.REPLACE,
        initialString: "FECHA EMISIÓN :",
        finalString: "Fecha de Emisión",
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
        type: FieldOperationType.REPLACE,
        initialString: "FECHA VCTO. : :",
        finalString: "Fecha de Vencimiento ",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Fecha de Vencimiento ",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "total_amount",
    operations: [
      {
        type: FieldOperationType.REPLACE,
        initialString: "TOTAL",
        finalString: "Total a Pagar $",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Total a Pagar $",
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
