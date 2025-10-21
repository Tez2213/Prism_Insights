/**
 * API Client for Prism Insights
 * Connects to AWS API Gateway + Lambda + DynamoDB
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  async getClients() {
    return this.fetchWithRetry(`${this.baseUrl}/clients`);
  }

  async getLicenses() {
    return this.fetchWithRetry(`${this.baseUrl}/licenses`);
  }

  async getLeads() {
    return this.fetchWithRetry(`${this.baseUrl}/leads`);
  }

  async getTechnicians() {
    return this.fetchWithRetry(`${this.baseUrl}/technicians`);
  }

  async getDepartments() {
    return this.fetchWithRetry(`${this.baseUrl}/departments`);
  }

  async getVendors() {
    return this.fetchWithRetry(`${this.baseUrl}/vendors`);
  }

  async getContracts() {
    return this.fetchWithRetry(`${this.baseUrl}/contracts`);
  }
}

export const apiClient = new ApiClient();
