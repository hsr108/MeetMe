import User from "../models/User.js";
import {Meeting }from "../models/Meeting.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const getUserHistory = async (req, res) => {
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY); 
        const user = await User.findById(decoded.id);  
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const {  meeting_code } = req.body;
    const token = req.cookies.token;
    try {
        const decoded  = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findById(decoded.id);
        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.json({ success: true, message: "Added code to history{ new Meeting Created } " })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

export { getUserHistory, addToHistory };    