import expressAsyncHandler from "express-async-handler"

export const fetchActiveFlights = expressAsyncHandler(async(req,res) => {
    res.send(["flight1","flight2"]);
})