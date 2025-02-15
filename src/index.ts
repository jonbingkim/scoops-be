import express from 'express';
import cors from "cors";
import 'dotenv/config';
import { type Request, type Response } from 'express';
import axios from 'axios';
import { supabase } from './db.ts';

const app = express();
const port = 3000;

const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';
const API_KEY = process.env.GOOGLE_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/suggestion', async (req: Request, res: Response): Promise<any> => {
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
    const score = response.data.attributeScores.TOXICITY.summaryScore.value;
    console.log(`Toxicity Score: ${score}`);

    if (score <= 0.1) {
      const { data, error } = await supabase
        .from('flavors')
        .insert([{ flavor: text }]);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: "Failed to insert flavor" });
      }

      console.log('Flavor submitted:', text);
      return res.status(200).json({ message: 'Flavor submitted successfully!' });
    } else {
      
      return res.status(200).json({ error: "Flavor contains inappropriate content" });
    }
  } catch (err) {
    console.error('Error in Perspective API:', err);
    return res.status(200).json({ error: "Failed to analyze text, Please try again" });
  }
});

app.get('/', async (req, res) => {
  try {
    let { data: flavors, error } = await supabase
      .from('flavors')
      .select('*');

    if (error) {
      console.error('Error fetching flavors:', error);
      return res.status(500).json({ error: "Failed to fetch flavors" });
    }

    const flavorList = flavors.map(flavor => flavor.flavor);
    res.json({ flavors: flavorList });
  } catch (err) {
    console.error('Error in GET /:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
