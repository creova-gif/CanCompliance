import { Router, type IRouter } from "express";
import healthRouter from "./health";
import complianceRouter from "./compliance";
import anthropicRouter from "./anthropic/index";
import openaiRouter from "./openai/index";
import apiKeysRouter from "./apikeys";
import ragRouter from "./rag";

const router: IRouter = Router();

router.use(healthRouter);
router.use(complianceRouter);
router.use(anthropicRouter);
router.use(openaiRouter);
router.use(apiKeysRouter);
router.use(ragRouter);

export default router;
