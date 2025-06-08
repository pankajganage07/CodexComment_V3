async function codeCheck(code) {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `answer in single word yes or no weather following code is java/python/xml/dotnet:\n${code}`;
    const result = await model.generateContent(prompt);
    return result;
  } catch (error) {
    res.json({
        msg: "Error generating comment",
        error: error.message,
      });
  }
}

async function model(code) {
    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
        const prompt = `generate comments for following code:\n${code}`;
        const result = await model.generateContent(prompt);
        console.log(result);
        
        return result;
      } catch (error) {
        console.log(error);
        res.json({
            msg: "Error generating comment",
            error: error.message,
          });
      }
}

module.exports = {codeCheck,model};
