/**
 * API Client for Data Simulator
 * Connects to backend via proxy to avoid CORS and mixed content issues
 * Can fetch from either simulator or DynamoDB via API Gateway
 */

// Determine which data source to use
const USE_DYNAMODB = process.env.NEXT_PUBLIC_USE_DYNAMODB === 'true';
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL;

// Use proxy route for production simulator, direct connection for local dev
const USE_PROXY = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const SIMULATOR_BASE_URL = USE_PROXY ? '/api/proxy' : (process.env.NEXT_PUBLIC_SIMULATOR_URL || 'http://localhost:8000');

// Choose the base URL based on configuration
const BASE_URL = USE_DYNAMODB && API_GATEWAY_URL ? API_GATEWAY_URL : SIMULATOR_BASE_URL;

class SimulatorClient {
  private baseUrl: string;
  private useDynamoDB: boolean;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
    this.useDynamoDB = USE_DYNAMODB && !!API_GATEWAY_URL;
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

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  async getHealth() {
    return this.fetchWithRetry(`${this.baseUrl}/health`);
  }

  async getStats() {
    return this.fetchWithRetry(`${this.baseUrl}/api/stats`);
  }

  async getClients() {
    return this.fetchWithRetry(`${this.baseUrl}/api/clients`);
  }

  async getLicenses() {
    return this.fetchWithRetry(`${this.baseUrl}/api/licenses`);
  }

  async getLeads() {
    return this.fetchWithRetry(`${this.baseUrl}/api/leads`);
  }

  async getTechnicians() {
    return this.fetchWithRetry(`${this.baseUrl}/api/technicians`);
  }

  async getDepartments() {
    return this.fetchWithRetry(`${this.baseUrl}/api/departments`);
  }

  async getVendors() {
    return this.fetchWithRetry(`${this.baseUrl}/api/vendors`);
  }

  async getContracts() {
    return this.fetchWithRetry(`${this.baseUrl}/api/contracts`);
  }

  async regenerateData() {
    const response = await fetch(`${this.baseUrl}/api/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async syncToDynamoDB() {
    const response = await fetch(`${this.baseUrl}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const simulatorClient = new SimulatorClient();
