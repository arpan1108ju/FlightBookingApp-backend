import express from 'express';
import { fetchActiveFlights } from '../../controllers/flightController.js/fetchActiveFlights.js';

const router = express.Router();

router.get('/user',(req,res)=> console.log("ok user"));

router.get('/fetch-active-flights',fetchActiveFlights);

export default router;