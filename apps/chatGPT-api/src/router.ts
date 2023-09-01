import { Request, Response, Router } from "express";
import Controller from "./controller";
import { FirestoreDatabase } from "./data/firestore";

export default function appRouter() {
  const database: FirestoreDatabase = new FirestoreDatabase();

  const controller = new Controller(database);
  const router = Router();

  router.post("/chat", async (request: any, response: any) => {
    try {
      const result = await controller.chatGPT(request.body);
      response.status(200).json(result);
    } catch (error) {
      console.error("[error]", error);
      response.status(500).json({ message: "Error en Chat GPT" });
    }
  });

  router.get("/prueba", async (request: any, response: any) => {
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
