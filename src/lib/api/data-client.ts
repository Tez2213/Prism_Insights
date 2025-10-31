/**
 * Unified Data Client for Prism Insights
 * Fetches data from DynamoDB via API Gateway
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hfvqci8mil.execute-api.us-east-2.amazonaws.com/prod';

class DataClient {
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
          cache: 'no-store', // Always get fresh data
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (i === retries - 1) {
          console.error(`Failed to fetch ${url} after ${retries} retries:`, error);
          throw error;
        }
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

export const dataClient = new DataClient();
