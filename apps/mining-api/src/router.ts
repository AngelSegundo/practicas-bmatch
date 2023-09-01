import { Request, Response, Router } from "express";
import Controller from "./controller";
import { FirestoreDatabase } from "./data/firestore";

export default function appRouter() {
  const database: FirestoreDatabase = new FirestoreDatabase();

  const controller = new Controller(database);
  const router = Router();

  router.post("/brisaguas", async (request: Request, response: Response) => {
    try {
      const result = await controller.brisaguas(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error minin brisaguas" });
    }
  });

  router.post("/enel-cl", async (request: Request, response: Response) => {
    try {
      const result = await controller.enelCL(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining Enel CL" });
    }
  });

  router.post("/cge", async (request: Request, response: Response) => {
    try {
      const result = await controller.cge(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining CGE" });
    }
  });

  router.post("/metrogas", async (request: Request, response: Response) => {
    try {
      const result = await controller.metrogas(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining Metrogas" });
    }
  });

  router.post("/abastible", async (request: Request, response: Response) => {
    try {
      const result = await controller.abastible(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining Abastible" });
    }
  });

  router.post("/lipigas", async (request: Request, response: Response) => {
    try {
      const result = await controller.lipigas(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining lipigas" });
    }
  });


  router.post(
    "/aguas-andinas",
    async (request: Request, response: Response) => {
      try {
        const result = await controller.aguasAndinas(request.body);
        response.status(200).json(result);
      } catch (error) {
        console.error("[error]", error);
        response.status(500).json({ message: "Error fetching aguas-andinas" });
      }
    }
  );

  router.post("/essal", async (request: Request, response: Response) => {
    try {
      const result = await controller.essal(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error minin essal" });
    }
  });

  router.post("/essbio", async (request: Request, response: Response) => {
    try {
      const result = await controller.essbio(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining essbio" });
    }
  });

  router.post("/esval", async (request: Request, response: Response) => {
    try {
      const result = await controller.esval(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining esval" });
    }
  });

  router.post("/saesa", async (request: Request, response: Response) => {
    try {
      const result = await controller.saesa(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining saesa" });
    }
  });

  router.post("/aguas-antofagasta", async (request: Request, response: Response) => {
    try {
      const result = await controller.aguasAntofagasta(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining saesa" });
    }
  });
  
  router.post("/aguas-del-valle", async (request: Request, response: Response) => {
    try {
      const result = await controller.aguasDelValle(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error mining aguas del valle" });
    }
  });

  router.get("/prueba", async (request: Request, response: Response) => {
    try {
      const result = await controller.prueba();
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error prueba" });
    }
  });
  


  return router;
}
