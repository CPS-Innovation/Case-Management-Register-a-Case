import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback";
import { BrowserRouter } from "react-router";
import Layout from "./Layout";
import { Auth } from "../auth";
import AppRoutes from "./AppRoutes";
import { CaseRegistrationProvider } from "../common/providers/CaseRegistrationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MaintenanceGuard from "./maintenance/MaintenanceGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <MaintenanceGuard>
          <QueryClientProvider client={queryClient}>
            <CaseRegistrationProvider>
              <Auth>
                <Layout>
                  <AppRoutes />
                </Layout>
              </Auth>
            </CaseRegistrationProvider>
          </QueryClientProvider>
        </MaintenanceGuard>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
