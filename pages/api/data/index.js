import dbConnect from "../../../utils/dbConnect";
import Data from "../../../models/Data";

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const dataGet = await Data.find();

                res.status(200).json({ success: true, data: dataGet });
            } catch (err) {
                res.status(400).json({ success: false, error: err });
            }
            break;
        case "POST":
            try {
                const dataPost = await Data.create(req.body);

                res.status(201).json({ success: true, data: dataPost });
            } catch (err) {
                res.status(400).json({ success: false, error: err });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}