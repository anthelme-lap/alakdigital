import { AppProviders } from '@/app/providers/app_providers';
import { AppRouter } from '@/app/router/app_router';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
