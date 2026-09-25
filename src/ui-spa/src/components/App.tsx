import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback";
import { BrowserRouter } from "react-router";
import Layout from "./Layout";
import { Auth } from "../auth";
import AppRoutes from "./AppRoutes";
import { CaseRegistrationProvider } from "../common/providers/CaseRegistrationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <QueryClientProvider client={queryClient}>
          <CaseRegistrationProvider>
            <Auth>
              <Layout>
                <AppRoutes />
              </Layout>
            </Auth>
          </CaseRegistrationProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
