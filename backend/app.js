const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Configuration = require("openai").Configuration;
const OpenAIApi = require("openai").OpenAIApi;

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_APIKEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from Praveen" });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt || "hello";

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    console.log(response.data.choices[0].text);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(3000);
