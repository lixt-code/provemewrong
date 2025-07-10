const { OpenAI } = require('openai');

exports.handler = async function(event, context) {
  const { message } = JSON.parse(event.body);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Prove me wrong: ${message}. Give me arguments that contradict this statement.`;


  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    });

    let reply = "";
    if (
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
    ) {
      reply = completion.choices[0].message.content.trim();
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
