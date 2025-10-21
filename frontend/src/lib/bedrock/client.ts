/**
 * AWS Bedrock Agent Client
 * Handles communication with the deployed Bedrock Agent via backend proxy
 */

export type AgentType = 'client-profitability' | 'software-license';

export class BedrockAgentClient {
  private apiEndpoint = '/api/bedrock';

  /**
   * Invoke the Bedrock Agent with a user query via backend API
   */
  async invokeAgent(prompt: string, sessionId: string, agentType: AgentType = 'client-profitability'): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          sessionId,
          agentType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to invoke agent');
      }

      const data = await response.json();
      return data.response || 'No response from agent';
    } catch (error) {
      console.error('Error invoking Bedrock Agent:', error);
      throw new Error(`Failed to invoke agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a unique session ID for conversation tracking
   */
  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

export const bedrockClient = new BedrockAgentClient();
