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

    // Debug: log the full response
    console.log('OpenAI response:', JSON.stringify(completion.data, null, 2));

    let reply = "";
    if (
      completion &&
      completion.data &&
      completion.data.choices &&
      completion.data.choices[0] &&
      completion.data.choices[0].message &&
      completion.data.choices[0].message.content
    ) {
      reply = completion.data.choices[0].message.content.trim();
    } else {
      reply = "No valid reply from OpenAI.";
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('OpenAI error:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error connecting to OpenAI" })
    };
  }
};
