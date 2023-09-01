import https from "https";
import axios from "axios";
import { MiningDate } from "domain/entities";

const MAIN_URL = "https://backsucursal.abastible.cl/api";

const requestOptions = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  method: "POST",
  url: MAIN_URL,
  headers: {
    Accept: "*/*",
  },
};

interface ResponseReading {
  status: string;
  data: {
    reading_month: string;
    reading_date: string;
    reading_id: string;
    reading_consumption: any;
    reading_value: any;
    reading_status: string;
    reading_can_update: boolean;
    reading_empty: boolean;
    now?: boolean;
  }[];
}

export interface AbastibleScrapInput {
  clientId: string;
}

export const AbastibleScrap = async ({
  clientId,
}: AbastibleScrapInput): Promise<MiningDate[]> => {
  const loginResponse = await axios<{ data: { token: string } }>(
    `${MAIN_URL}/login/email`,
    {
      ...requestOptions,
      data: {
        email: "cuentasnubisk@gmail.com",
        password: "79adc6e80f46d23e",
      },
    }
  );

  const token = loginResponse.data.data.token;

  // get current date YYYY-MM-DD
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() - 1);
  const endDateString = endDate.toISOString().split("T")[0];

  // get date of 12 month earlier
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 13);
  const startDateString = startDate.toISOString().split("T")[0];

  const dataResponse = await axios<ResponseReading>(
    `${MAIN_URL}/reading/list`,
    {
      ...requestOptions,
      data: {
        star_month: startDateString,
        end_month: endDateString,
        contract_cod: clientId,
        token: token,
      },
    }
  );

  console.log(dataResponse.data);

  const readingsRaw = dataResponse.data.data;

  const readings = readingsRaw.map((reading) => {
    const [year, month, day] = reading.reading_date.split("-");
    // get iso date string
    const dateString = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day ?? 1)
    ).toISOString();

    return {
      month: month.toString(),
      year: year.toString(),
      value: parseFloat(reading.reading_consumption),
      date: dateString,
    };
  });

  return readings;
};
