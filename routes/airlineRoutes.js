import express from "express";
import { addFlight } from "../controllers/airlineController/addFlightContoller.js";
import { getFlight } from "../controllers/airlineController/getFlightDetailsController.js";
import { updateFlight } from "../controllers/airlineController/updateFlightContorller.js";

const router = express.Router();

//For adding new flight details.
router.post('/add-details', addFlight);

//For getting flight details
router.get('/get-details/flight-id/:flightId', getFlight);

//For updating flight details
router.put('/update-details', updateFlight);


export default router;