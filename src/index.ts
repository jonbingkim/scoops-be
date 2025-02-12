import express from 'express';
import 'dotenv/config';
import { type Request, type Response } from 'express';
import { OpenAI } from 'openai';
import axios from 'axios';
import { supabase } from './db.ts'

const app = express();
const port = 3000;

const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';
const API_KEY = process.env.GOOGLE_API_KEY;

//come back to this later, maybe not really useful bc perspective is good :)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

app.use()
app.use(express.json());

app.post('/suggestion', async (req: Request, res: Response) : Promise<any>=> {
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
    const score = (response.data.attributeScores.TOXICITY.summaryScore.value);
    if (score > .04) {
      const { data, error } = await supabase
    .from('flavors')
    .insert([
    { flavor: text },
  ])
  .select()
}
    // } else {
    //   res.status
    // }
    console.log(response.data)
    return res.status(200).json('flavor submitted succesfully!')
    
  } catch (err) {
    console.error('Error in Perspective API:', err);
    return res.status(500).json({ error: "Failed to analyze text" });
  }
});

app.get('/', async (req,res) => {

  let { data: flavors, error } = await supabase
  .from('flavors')
  .select('*')
  console.log({flavors})
  const flavorList = flavors.map(flavor => flavor.flavor)
  res.send({flavors: flavorList});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


