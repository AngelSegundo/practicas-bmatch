import IaController from '../controllers/ia'
import { Router, Response, Request } from "express";

export default function aiRouter({controller }: { controller: IaController}) {
 const router = Router();
 
 router.post("/chat",
 async (request: Request, response: Response) => {
  try {
    const result = await controller.chatGPT(request.body);
    response.status(200).json(result);
  } catch (error) {
    console.error("[error]", error);
    response.status(500).json({ message: `Error en Chat GPT ${error}`  });
  }
});

return router;
}