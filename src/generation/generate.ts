import ollama from "ollama";

interface GenerateOptions {
  question: string;
  context: string[];
}

export async function generateAnswer({ question, context }: GenerateOptions) {
  const formattedContext = context
    .map((item, index) => `[${index + 1}]\n${item}`)
    .join("\n\n");

  const prompt = `

                You are a company knowledge assistant.

                Your task is to answer questions using ONLY the provided context.

                STRICT RULES:

                1. Use only information explicitly stated in the context.

                2. Never use your own knowledge to fill gaps.

                3. Never assume, infer, or invent missing information.

                4. If the context does not contain enough information to answer,

                respond with:

                "I don't have enough information to answer this question."

                5. If only part of the question can be answered, explain what

                information is available and what is missing.

                6. If multiple sources contradict each other, mention the conflict.

                7. Keep answers clear and concise.

                CONTEXT:

                ${formattedContext}

                QUESTION:

                ${question}

                ANSWER:

`;

  const response = await ollama.generate({
    model: "qwen3:1.7b",
    prompt,
    stream: false,
  });

  return response.response;
}
