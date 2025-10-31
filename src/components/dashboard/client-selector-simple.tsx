'use client';

import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dataClient } from '@/lib/api/data-client';
import { useClient } from '@/lib/contexts/client-context';

interface Client {
  id: string;
  name: string;
  monthlyRevenue?: number;
}

interface ClientSelectorSimpleProps {
  collapsed?: boolean;
}

export function ClientSelectorSimple({ collapsed = false }: ClientSelectorSimpleProps) {
  const { selectedClientId, setSelectedClientId } = useClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await dataClient.getClients();
        console.log('Simple selector - fetched data:', data);
        
        if (Array.isArray(data)) {
          const transformedClients = data.map((client: any) => ({
            id: client.id || client.clientId || Math.random().toString(),
            name: client.name || client.companyName || 'Unknown Client',
            monthlyRevenue: client.monthlyRecurring || client.monthlyRevenue || (client.annualRevenue ? client.annualRevenue / 12 : 0),
          }));
          setClients(transformedClients);
          
          // Don't auto-select - let user choose
          // User will see "Select Client ***" by default
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const selectedClientData = clients.find((client) => client.id === selectedClientId);

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 h-10">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="px-3 py-2">
        <div className="flex items-center justify-center w-full h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
          <Building2 className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <div className="mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
          Selected Client
        </span>
      </div>
      <div className="relative">
        <select
          value={selectedClientId}
          onChange={(e) => {
            console.log('Client changed to:', e.target.value);
            setSelectedClientId(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-10"
        >
          <option value="" disabled>
            Select Client ***
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - ${Math.round(client.monthlyRevenue || 0).toLocaleString()}/mo
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Building2 className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {selectedClientData && (
        <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <span className="font-medium">{selectedClientData.name}</span>
            <br />
            <span className="text-gray-500">
              ${Math.round(selectedClientData.monthlyRevenue || 0).toLocaleString()}/mo revenue
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
