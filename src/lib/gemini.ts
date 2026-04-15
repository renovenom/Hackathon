export type ModelType = "V3" | "R1" | "Lite";

export async function* generateChatResponse(
  messages: { role: "user" | "model"; parts: { text: string }[] }[],
  modelType: ModelType,
  temperature: number = 0.7,
  topP: number = 0.95,
  maxOutputTokens?: number
) {
  let modelName = "deepseek-chat";

  if (modelType === "R1") {
    modelName = "deepseek-reasoner";
  } else {
    modelName = "deepseek-chat";
  }

  const API_KEY = "sk-ed461a92d1fc4d4eb738d649a29607ef";
  const API_URL = "https://api.deepseek.com/chat/completions";

  const formattedMessages = messages.map(m => ({
    role: m.role === "model" ? "assistant" : "user",
    content: m.parts[0].text
  }));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: formattedMessages,
        stream: true,
        temperature: modelType === "R1" ? undefined : temperature, // DeepSeek R1 might not support temperature tuning in the same way
        top_p: modelType === "R1" ? undefined : topP,
        max_tokens: maxOutputTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API Error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let isReasoning = false;
    let hasStartedReasoning = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.trim() === "data: [DONE]") return;

        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            const delta = data.choices[0]?.delta;
            if (!delta) continue;

            let chunkText = "";

            if (delta.reasoning_content) {
              if (!hasStartedReasoning) {
                chunkText += "<reasoning>\n";
                hasStartedReasoning = true;
                isReasoning = true;
              }
              chunkText += delta.reasoning_content;
            } else if (delta.content) {
              if (isReasoning) {
                chunkText += "\n</reasoning>\n\n";
                isReasoning = false;
              }
              chunkText += delta.content;
            }

            if (chunkText) {
              yield { text: chunkText };
            }
          } catch (e) {
            console.warn("Error parsing stream line:", line, e);
          }
        }
      }
    }

    // If stream ended while reasoning was still open (shouldn't happen usually, but just in case)
    if (isReasoning) {
      yield { text: "\n</reasoning>\n\n" };
    }

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
