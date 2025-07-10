const { Configuration, OpenAIApi } = require('openai');

exports.handler = async function(event, context) {
  const { message } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error connecting to OpenAI" })
    };
  }
};
