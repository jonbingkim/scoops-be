import express from 'express';
import 'dotenv/config';
import { OpenAI } from 'openai';
import axios from 'axios';
import { supabase } from './db';
const app = express();
const port = 3000;
const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';
const API_KEY = process.env.GOOGLE_API_KEY;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.use(express.json());
app.post('/suggestion', async (req, res) => {
    const text = req.body.text;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "No valid text provided" });
    }
    const analyzeRequest = {
        comment: { text },
        requestedAttributes: { TOXICITY: {} },
    };
    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, analyzeRequest);
        return res.json(response.data);
    }
    catch (err) {
        console.error('Error in Perspective API:', err);
        return res.status(500).json({ error: "Failed to analyze text" });
    }
});
console.log(supabase);
app.get('/', async (req, res) => {
    let { data: flavors, error } = await supabase
        .from('flavors')
        .select('*');
    console.log({ flavors });
    res.send({ flavors });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
