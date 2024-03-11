import express from "express" ;
import { createEntry, deleteEntry, getAllEntries, sendEntry, updateEntry } from "../controllers/alloperations.js";

const router = express.Router();


router.post("/creatEntry",createEntry);
router.post("/updateEntry",updateEntry);
router.post("/deleteEntry",deleteEntry);
router.get("/getAllEntry",getAllEntries);
router.post("/sendEntry",sendEntry);

export default router;