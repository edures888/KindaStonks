import express from 'express';
import CheckinController from '../controllers/checkinController.js';

const router = express.Router();

router.route('/').post(CheckinController.addCheckin).get(CheckinController.isTodayCheckin);

export default router;
