import driver from "../../utils/neo4j-driver.js";
import parser from 'parse-neo4j';

export const getFlight = (req, res)=>{
    const {flightId} = req.params;
    // const flightId = req.query.flightId;
    res.send({message: `Flight details for ${flightId}`});
}