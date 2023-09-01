import { Request, RequestHandler, Response, Router } from "express";
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
  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const country = await controller.getById(id);
      response.status(200).json(country);
    } catch (error) {
      response.status(404).json({ message: "Error getting country" });
    }
  });

  return router;
}
