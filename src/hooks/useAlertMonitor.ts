import { useEffect, useRef } from 'react';
import { useAlertStore } from '@/lib/stores/alertStore';
import { simulatorClient } from '@/lib/api/simulator-client';

export function useAlertMonitor() {
  const addAlert = useAlertStore((state) => state.addAlert);
  const previousDataRef = useRef<any>({});

  useEffect(() => {
    const checkForAlerts = async () => {
      try {
        // Fetch current data
        const [clients, licenses, leads] = await Promise.all([
          simulatorClient.getClients(),
          simulatorClient.getLicenses(),
          simulatorClient.getLeads(),
        ]);

        // Check for client status changes
        clients.forEach((client: any) => {
          const prevClient = previousDataRef.current.clients?.find((c: any) => c.id === client.id);
          
          if (prevClient) {
            // Status changed
            if (prevClient.status !== client.status) {
              addAlert({
                type: 'client-status',
                title: `Client Status Changed: ${client.name}`,
                message: `Status changed from "${prevClient.status}" to "${client.status}"`,
                severity: client.status === 'At Risk' ? 'critical' : 'warning',
              });
            }
            
            // Churn risk increased
            if (prevClient.churnRisk !== client.churnRisk && client.churnRisk === 'High') {
              addAlert({
                type: 'churn-risk',
                title: `High Churn Risk: ${client.name}`,
                message: `Churn risk increased to HIGH - immediate action required`,
                severity: 'critical',
              });
            }
          }
        });

        // Check for license usage alerts
        licenses.forEach((license: any) => {
          const prevLicense = previousDataRef.current.licenses?.find((l: any) => l.id === license.id);
          
          if (prevLicense) {
            // Utilization dropped significantly
            if (prevLicense.utilizationRate - license.utilizationRate > 15) {
              addAlert({
                type: 'license-usage',
                title: `License Usage Drop: ${license.vendor} ${license.product}`,
                message: `Utilization dropped from ${prevLicense.utilizationRate.toFixed(1)}% to ${license.utilizationRate.toFixed(1)}%`,
                severity: 'warning',
              });
            }
            
            // Over-allocated
            if (license.usedLicenses > license.totalLicenses) {
              addAlert({
                type: 'license-usage',
                title: `License Over-Allocated: ${license.vendor} ${license.product}`,
                message: `Using ${license.usedLicenses} licenses but only have ${license.totalLicenses}`,
                severity: 'critical',
              });
            }
          }
        });

        // Check for lead progression
        leads.forEach((lead: any) => {
          const prevLead = previousDataRef.current.leads?.find((l: any) => l.id === lead.id);
          
          if (prevLead && prevLead.stage !== lead.stage) {
            addAlert({
              type: 'lead-progress',
              title: `Lead Progressed: ${lead.companyName}`,
              message: `Moved from "${prevLead.stage}" to "${lead.stage}" ($${Math.round(lead.value).toLocaleString()})`,
              severity: lead.stage === 'Closed Won' ? 'info' : 'info',
            });
          }
        });

        // Store current data for next comparison
        previousDataRef.current = { clients, licenses, leads };
      } catch (error) {
        console.error('Error checking for alerts:', error);
      }
    };

    // Initial check
    checkForAlerts();

    // Check every 5 seconds
    const interval = setInterval(checkForAlerts, 5000);

    return () => clearInterval(interval);
  }, [addAlert]);
}
