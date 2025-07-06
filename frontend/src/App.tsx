import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/components/Dashboard';
import DiseaseDetection from '@/components/DiseaseDetection';
import Chatbot from '@/components/Chatbot';
import HospitalBeds from '@/components/HospitalBeds';
import BloodDonor from '@/components/BloodDonor';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import DietPlanForm from './components/Diet';
import TrackPeriod from './components/TrackPeriod';
import HealthInsurance from './components/Insurance';
import MedicalReport from './components/Report';
import RecommendHealthInsurance from './components/Recommend';
import ConsentSimplifier from './components/ConsentSimplifier';

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  return location.pathname !== '/' ? (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full fixed z-50 bottom-0 left-0 max-w-screen-lg px-6 py-4"
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-[18px] p-6 gap-2 shadow-md hover:shadow-lg transition-all"
        onClick={() => navigate(-1)} 
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </motion.div>
  ) : null;
}

function App() {
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col items-center">
          <BackButton />

          <div className="w-full max-w-screen-lg px-6 py-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/disease-detection" element={<DiseaseDetection />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/insurance" element={<HealthInsurance />} />
                <Route path="/diet" element={<DietPlanForm />} />
                <Route path="/hospital-beds" element={<HospitalBeds />} />
                <Route path="/consent-simplifier" element={<ConsentSimplifier />} />
                <Route path="/report" element={<MedicalReport />} />
                <Route path="/track" element={<TrackPeriod />} />
                <Route path="/blood-donor" element={<BloodDonor />} />
                <Route path="/recommend" element={<RecommendHealthInsurance />} />
              </Routes>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link
              to="/track"
              className="flex items-center justify-center w-[70px] h-[70px] md:w-[80px]  border-[4px] border-pink-500 md:h-[80px] rounded-full shadow-lg transition-all"
            >
              <img
                src="/icon-512x512.png"
                alt="Menstrual Tracker"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </Link>
          </motion.div>


          <Dialog open={showEmergency} onOpenChange={setShowEmergency}>
            <DialogContent className="backdrop-blur-lg bg-white/80 shadow-xl border border-red-500">
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Emergency Alert!
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                This will notify your emergency contacts and share your location. Are you sure?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEmergency(false)}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button variant="destructive">
                  <AlertCircle className="h-5 w-5" /> Send Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
