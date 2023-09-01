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
        initialString: "N° ",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "client_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "N° CLIEN TE",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "client_name",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Sr(a). ",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "client_address",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Dirección Suministro:",
        finalString: " - ",
      },
    ],
  },
  {
    fieldName: "client_comuna",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Dirección Suministro:",
        finalString: "Datos de mi suministro",
      },
    ],
  },
  {
    fieldName: "pricing_plan",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Tipo",
        finalString: "Potencia",
      },
    ],
  },
  {
    fieldName: "client_route",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Ruta:",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "fixed_price",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Administración del servicio $ ",
        finalString: "tu medidor",
      },
    ],
  },
  {
    fieldName: "user_consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Consumo total del mes= ",
        finalString: "kWh",
      },
    ],
  },
  {
    fieldName: "consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Electricidad Consumida",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Electricidad Consumida",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "total_month",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Total boleta $",
        finalString: "¿Cuál",
      },
    ],
  },
  {
    fieldName: "tax_amount",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Iva $",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "issued_date",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Fecha de Emisión:",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "due_date",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Fecha de vencimiento ",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "total_amount",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Monto afecto a impuesto $ ",
        finalString: " ",
      },
    ],
  },
];
