import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/i18nContext';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TaxNomadCalculator from '@/pages/TaxNomadCalculator';
import TermsOfService from '@/pages/TermsOfService';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <Router>
            <Routes>
              <Route path="/" element={<TaxNomadCalculator />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<TaxNomadCalculator />} />
            </Routes>
          </Router>
          <Toaster position="top-center" richColors />
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
