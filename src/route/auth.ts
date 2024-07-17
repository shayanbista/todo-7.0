import { Router } from "express";
import { login } from "../controller/auth";

const authRouter = Router();

authRouter.post("/login", login);
// authRouter.post("/refresh-token", refreshToken);

export default authRouter;
