var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from "cors";
import 'dotenv/config';
import axios from 'axios';
import { supabase } from './db.js';
const app = express();
const port = 3000;
const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';
const API_KEY = process.env.GOOGLE_API_KEY;
app.use(cors());
app.use(express.json());
app.post('/suggestion', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = req.body.text;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "No valid text provided" });
    }
    const analyzeRequest = {
        comment: { text },
        requestedAttributes: { TOXICITY: {} },
    };
    try {
        const response = yield axios.post(`${API_URL}?key=${API_KEY}`, analyzeRequest);
        const score = response.data.attributeScores.TOXICITY.summaryScore.value;
        console.log(`Toxicity Score: ${score}`);
        if (score <= 0.1) {
            const { data, error } = yield supabase
                .from('flavors')
                .insert([{ flavor: text }]);
            if (error) {
                console.error('Supabase insert error:', error);
                return res.status(500).json({ error: "Failed to insert flavor" });
            }
            console.log('Flavor submitted:', text);
            return res.status(200).json({ message: 'Flavor submitted successfully!' });
        }
        else {
            return res.status(200).json({ error: "Flavor contains inappropriate content" });
        }
    }
    catch (err) {
        console.error('Error in Perspective API:', err);
        return res.status(200).json({ error: "Failed to analyze text, Please try again" });
    }
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { data: flavors, error } = yield supabase
            .from('flavors')
            .select('*');
        if (error) {
            console.error('Error fetching flavors:', error);
            return res.status(500).json({ error: "Failed to fetch flavors" });
        }
        const flavorList = flavors.map(flavor => flavor.flavor);
        res.json({ flavors: flavorList });
    }
    catch (err) {
        console.error('Error in GET /:', err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
