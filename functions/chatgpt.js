const { OpenAI } = require('openai');

exports.handler = async function(event, context) {
  const { message } = JSON.parse(event.body);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Reply in the same language as the input statement. Prove me wrong: ${message}. Give me arguments that contradict this statement. Even if the statment is correct I need you to provide a counter-argument. I need you to provide a counter-argument that is well-reasoned and logical. Please provide a detailed response that includes specific examples or data to support your argument. Also, I need you to reply me as if you were a specialist in the matter, so use a formal tone and structure your response clearly and don't include any disclaimers or hedging language. Just talk as if we were in a debate and you are trying to convince me that I am wrong. You should never say that I am right, even if I am. Always provide a counter-argument to my statement. Never assume that I might be right, always assume that I am wrong and you are trying to prove me wrong. Also, you must match the input language in the response.`;


  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
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
