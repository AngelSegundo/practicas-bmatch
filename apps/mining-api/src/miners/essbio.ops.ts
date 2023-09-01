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
        initialString: "<Folio>",
        finalString: "</Folio>",
      },
    ],
  },
  {
    fieldName: "client_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<Attribute Type="NOCUENTA">',
        finalString: "</Attribute>",
      },
    ],
  },
  {
    fieldName: "client_name",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<RznSocRecep>",
        finalString: "</RznSocRecep>",
      },
    ],
  },
  {
    fieldName: "client_address",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<DirRecep>",
        finalString: "</DirRecep>",
      },
    ],
  },
  {
    fieldName: "client_comuna",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<CmnaRecep>",
        finalString: "</CmnaRecep>",
      },
    ],
  },
  {
    fieldName: "counter_id",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<campoString name="lineaconsumo1">Medidor',
        finalString: "</campoString>",
      },
    ],
  },
  {
    fieldName: "pricing_plan",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<campoString name="grupotarifario">',
        finalString: "</campoString>",
      },
    ],
  },
  {
    fieldName: "client_route",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<campoString name="ruta">',
        finalString: "</campoString>",
      },
    ],
  },
  {
    fieldName: "fixed_price",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<PrcItem>",
        finalString: "</PrcItem>",
      },
    ],
  },
  {
    fieldName: "user_consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<NmbItem>Consumo Agua Potable",
        finalString: "<MontoItem>",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<PrcItem>",
        finalString: "</PrcItem>",
      },
    ],
  },
  {
    fieldName: "consumption",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<campoString name="lineaconsumo9">Consumo Facturado',
        finalString: "</campoString>",
      },
    ],
  },
  {
    fieldName: "current_price_adjustments",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<NmbItem>Ajuste Sencillo</NmbItem>",
        finalString: "</MontoItem>",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<PrcItem>",
        finalString: "</PrcItem>",
      },
    ],
  },
  {
    fieldName: "previous_price_adjustments",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<NmbItem>Ajuste Sencillo Anterior</NmbItem>",
        finalString: "</MontoItem>",
      },
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<PrcItem>",
        finalString: "</PrcItem>",
      },
    ],
  },
  {
    fieldName: "total_month",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<MntTotal>",
        finalString: "</MntTotal>",
      },
    ],
  },
  {
    fieldName: "tax_amount",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<IVA>",
        finalString: "</IVA>",
      },
    ],
  },
  {
    fieldName: "issued_date",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<Attribute Type="FECHAEMISION">',
        finalString: "</Attribute>",
      },
    ],
  },
  {
    fieldName: "due_date",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: '<Attribute Type="FECHAVENCIMIENTO">',
        finalString: "</Attribute>",
      },
    ],
  },
  {
    fieldName: "total_amount",
    operations: [
      {
        type: FieldOperationType.EXTRACT,
        initialString: "<VlrPagar>",
        finalString: "</VlrPagar>",
      },
    ],
  },
];
