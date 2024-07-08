import driver from "../../utils/neo4j-driver.js";
import parser from 'parse-neo4j';

export const updateFlight = (req, res)=>{
    const {flightId, departureTime, arrivalTime, departureAirport, arrivalAirport
        } = req.body;
    res.status(200).json({message:`flight updated successfully for id = ${flightId}`});

}