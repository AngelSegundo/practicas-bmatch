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
        initialString: "Montt Nº",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "client_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Número de Cliente: ",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "fixed_price",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "CARGO FIJO",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "counter_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Número de Medidor ",
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
    fieldName: "user_consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "DIFERENCIA DE LECTURAS",
        finalString: "m3",
      },
    ],
  },
  {
    fieldName: "current_price_adjustments",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "AJUSTE SENCILLO ACTUAL",
        finalString: "INDEMNIZACION LEY DEL CONSUMIDOR",
      },
    ],
  },
  {
    fieldName: "client_route",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "RUTA:",
        finalString: "MEC",
      },
    ],
  },
  {
    fieldName: "tax_amount",
    operations: [
      {
        type: FieldOperationType.REPLACE,

        initialString: "El IVA de esta Boleta es",
        finalString: "I.V.A.(19%)",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "I.V.A.(19%)",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "period",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Factor de cobro del período",
        finalString: "\n",
      },
    ],
  },
  {
    fieldName: "issued_date",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "Fecha de emision : ",
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
        finalString: "DETALLE DE CUENTA",
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
];
