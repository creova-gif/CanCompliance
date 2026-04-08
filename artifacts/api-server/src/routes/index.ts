import { Router, type IRouter } from "express";
import healthRouter from "./health";
import complianceRouter from "./compliance";
import anthropicRouter from "./anthropic/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(complianceRouter);
router.use(anthropicRouter);

export default router;
