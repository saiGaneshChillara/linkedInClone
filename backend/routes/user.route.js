import express from 'express';

import { protectRoute } from '../middleware/auth.middleware.js';
import { getSuggestedUsers, getUserProfile, updateCredentials, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedUsers);
router.get("/:username", protectRoute, getUserProfile);

router.put("/update", protectRoute, updateProfile);
router.put("/update-credentials", protectRoute, updateCredentials);

export default router;