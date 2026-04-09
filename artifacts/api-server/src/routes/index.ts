import { Router, type IRouter } from "express";
import healthRouter from "./health";
import complianceRouter from "./compliance";
import anthropicRouter from "./anthropic/index";
import openaiRouter from "./openai/index";
import apiKeysRouter from "./apikeys";

const router: IRouter = Router();

router.use(healthRouter);
router.use(complianceRouter);
router.use(anthropicRouter);
router.use(openaiRouter);
router.use(apiKeysRouter);

export default router;
