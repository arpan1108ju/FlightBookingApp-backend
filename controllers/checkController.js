import driver from "../utils/neo4j-driver.js";
import parser from 'parse-neo4j';

export const check = async (req, res) => {

    const query = `MATCH (n:DemoUser) RETURN n;`;
    const context = {};
    const result = parser.parse(await driver.executeQuery(query,context));

    if(result.length === 0){
        res.status(500);
        throw new Error("Book not found");
    }

    res.send(result);
}