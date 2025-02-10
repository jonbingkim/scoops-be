import express from 'express';
import 'dotenv/config'; // Load environment variables
import './db.ts'; // Your db.ts, assuming it’s a module
import { OpenAI } from 'openai'; // Corrected import for OpenAI

const app = express();
const port = 3000;

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you set this in your .env file
});

// Function to handle moderation logic
async function checkModeration() {
  try {
    const moderation = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: '씨발', // Text to be classified
    });

    console.log('Moderation result:', moderation);
  } catch (error) {
    console.error('Error during moderation:', error);
  }
}

// Call the checkModeration function
checkModeration();

// Express server setup
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, from Express in the dist folder!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



//TO DO!!!!!!!!!
//perspective API
//send it to openAI moderation
//should be good after that tbh

