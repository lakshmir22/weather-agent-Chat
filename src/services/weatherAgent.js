const WEATHER_AGENT_URL = 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream';

export class WeatherAgentService {
  static async sendMessage(messages, threadId, onMessage = null, onError = null) {
    try {
      const response = await fetch(WEATHER_AGENT_URL, {
        method: 'POST',
        headers: {
          'x-mastra-dev-playground': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          runId: "weatherAgent",
          maxRetries: 2,
          maxSteps: 5,
          temperature: 0.5,
          topP: 1,
          runtimeContext: {},
          threadId: 2,
          resourceId: "weatherAgent"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hasToolResult = false;
      let streamedContent = '';
      let lastSentContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              // Handle the streaming format: prefix:data
              if (line.includes(':')) {
                const colonIndex = line.indexOf(':');
                const prefix = line.substring(0, colonIndex);
                const data = line.substring(colonIndex + 1);
                
                // Handle different prefixes
                if (prefix === 'a') {
                  // Tool call results with weather data
                  const parsed = JSON.parse(data);
                  if (parsed.toolCallId && parsed.result) {
                    const result = parsed.result;
                    if (result.temperature && result.location) {
                      hasToolResult = true;
                      
                      // Check if user asked specifically for temperature
                      const lastMessage = messages[messages.length - 1];
                      const isTempOnlyRequest = lastMessage && lastMessage.content && 
                        (lastMessage.content.toLowerCase().includes('temp') || 
                         lastMessage.content.toLowerCase().includes('temperature')) &&
                        !lastMessage.content.toLowerCase().includes('humidity') &&
                        !lastMessage.content.toLowerCase().includes('wind') &&
                        !lastMessage.content.toLowerCase().includes('condition') &&
                        !lastMessage.content.toLowerCase().includes('weather');
                      
                      let content;
                      if (isTempOnlyRequest) {
                        // Show only temperature
                        content = `${result.temperature}°C`;
                      } else {
                        // Show full weather data
                        content = `Current weather in ${result.location}: ${result.temperature}°C, feels like ${result.feelsLike}°C. Humidity: ${result.humidity}%, Wind: ${result.windSpeed} km/h (gusts up to ${result.windGust} km/h). Conditions: ${result.conditions}.`;
                      }
                      
                      // Only send if different from last sent content
                      if (onMessage && content !== lastSentContent) {
                        onMessage({ content });
                        lastSentContent = content;
                      }
                    }
                  }
                } else if (prefix === '0' && !hasToolResult) {
                  // Only process streaming text if we haven't already shown tool result
                  const textChunk = JSON.parse(data);
                  if (textChunk && textChunk.trim()) {
                    streamedContent += textChunk;
                    // Only send if different from last sent content and not duplicate
                    if (onMessage && textChunk !== lastSentContent && !lastSentContent.includes(textChunk)) {
                      onMessage({ content: textChunk });
                      lastSentContent = streamedContent;
                    }
                  }
                } else if (prefix === 'e' || prefix === 'd') {
                  // End markers - we've handled everything above
                  break;
                }
              }
              // Handle Server-Sent Events format
              else if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  return;
                }
                const parsed = JSON.parse(data);
                
                if (onMessage && parsed.content) {
                  onMessage({ content: parsed.content });
                }
              } 
              // Handle regular JSON responses
              else {
                const parsed = JSON.parse(line);
                if (onMessage && parsed.content) {
                  onMessage({ content: parsed.content });
                }
              }
            } catch (e) {
              console.warn('Failed to parse message:', line, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Weather Agent API Error:', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }
}