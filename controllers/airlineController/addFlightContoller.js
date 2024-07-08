import driver from "../../utils/neo4j-driver.js";
import parser from 'parse-neo4j';

export const addFlight = (req, res)=>{
    res.status(200).json({message: 'flight added'});
}