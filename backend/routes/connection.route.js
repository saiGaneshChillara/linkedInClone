import express from "express";
import { acceptConnectionRequest, declineConnectionRequest, getConnectionRequests, getConnectionStatus, getUserConnections, removeConnection, sendConnectionReques } from "../controllers/connection.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUserConnections);
router.get("/requests", protectRoute, getConnectionRequests);
router.get("/status/:userId", protectRoute, getConnectionStatus);

router.post("/request/:userId", protectRoute, sendConnectionReques);

router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectRoute, declineConnectionRequest);

router.delete('/:userId', protectRoute, removeConnection)


export default router;