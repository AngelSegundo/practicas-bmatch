import { Request, Response, Router } from "express";
import CountryController from "../controllers/countries";

export default function countriesRouter({
  controller,
}: {
  controller: CountryController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const countries = await controller.getAll();
      response.status(200).json(countries);
    } catch (error) {
      console.error("[error]", JSON.stringify(error));
      response.status(500).json({ message: "Error fetching countries" });
    }
  });

  return router;
}
