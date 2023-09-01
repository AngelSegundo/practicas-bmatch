import {
    FieldOperationType,
    MiningFieldOperation,
  } from "../interfaces/MiningFieldOperation";
  
  export const ticketOps: MiningFieldOperation[] = [
    {
        fieldName: "ticket_id",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: '<Attribute Type="FOLIO">',
            finalString: '</Attribute>',
          },
        ]
      },
      {
        fieldName: "client_id",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: '<CdgIntRecep>',
            finalString: '</CdgIntRecep>',
          },
        ]
      },
      {
        fieldName: "client_name",
        operations: [{
          type: FieldOperationType.EXTRACT,
          initialString: '<RznSocRecep>',
          finalString: '</RznSocRecep>',
        }]
      },
      {
        fieldName: "client_address",
        operations: [{
          type: FieldOperationType.EXTRACT,
          initialString: '<DirRecep>',
          finalString: '</DirRecep>',
        }, ]
      },
      {
        fieldName: "client_comuna",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: '<CmnaRecep>',
            finalString: '</CmnaRecep>',
          },
        ]
      },
      {
        fieldName: "counter_id",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'MedidorActual</NombreDA>\n      <ValorDA>',
            finalString: '</ValorDA>',
          },
        ]
      },
      {
        fieldName: "pricing_plan",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'Tarifa</NombreDA>\n        <ValorDA>',
            finalString: '</ValorDA>',
          },
        ]
      },
      {
        fieldName: "client_route",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'Num_Interno</NombreDA>\n      <ValorDA>',
            finalString: '</ValorDA>',
          },
        ]
      },
      {
        fieldName: "user_consumption",
        operations: [{
          type: FieldOperationType.EXTRACT,
          initialString: 'Gas consumido (',
          finalString: 'm3s )',
        }]
      },
      /* {
        fieldName: "user_consumption",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'Gas consumido',
            finalString: '/Monto>',
          },
          // {
          //     initialString        : '>',
          //     finalString           : '<',
          //     numberLinesToDelete  : 1,
          //     reverse              : true
          // },
          // {
          //     initialString        : '>',
          //     finalString           : '<',
          // }
        ]
      }, */
      {
        fieldName: "previous_price_adjustments",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'LActLect</NombreDA>\n        <ValorDA>',
            finalString: '</ValorDA>',
          },
        ]
      },
      {
        fieldName: "current_price_adjustments",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'LAntLect</NombreDA>\n        <ValorDA>',
            finalString: '</ValorDA>',
          },
        ]
      },
      {
        fieldName: "tax_amount",
        operations: [{
          type: FieldOperationType.EXTRACT,
          initialString: '<IVA>',
          finalString: '</IVA>',
        }]
      },
      {
        fieldName: "issued_date",
        operations: [{
          type: FieldOperationType.EXTRACT,
          initialString: '<FchEmis>',
          finalString: '</FchEmis>',
        }, ]
      },
      {
        fieldName: "due_date",
        operations: [{
          type: FieldOperationType.EXTRACT,
          initialString: '<FchVenc>',
          finalString: '</FchVenc>',
        }, ]
      },
      {
        fieldName: "total_amount",
        operations: [{
            type: FieldOperationType.EXTRACT,
            initialString: 'TOTAL A PAGAR</Titulo>\n        <Detalle/>\n        <Monto>',
            finalString: '</Monto>',
          },
        ]
      }
  ];
  