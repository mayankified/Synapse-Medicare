// This is the updated React component. Replace your existing component code with this.

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, FileText, CheckCircle, AlertTriangle, Heart, Database, ShieldCheck, Stethoscope, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy content remains the same
const originalConsentText = `I, the undersigned, hereby authorize and direct Dr. Arjun Gupta and his associates or assistants to perform the following medical procedure, known as a 'cardiac catheterization', upon myself. I have been informed of the nature, consequences, risks, and benefits of this procedure, including but not limited to potential complications such as hemorrhage, infection, myocardial infarction, and adverse reactions to anesthesia. I consent to the use of my anonymized clinical data, including procedural outcomes and diagnostic imaging, for the purposes of medical research, educational advancement, and quality assurance protocols. This consent is given voluntarily and I acknowledge that I am at liberty to withdraw my consent at any time prior to the commencement of the procedure.`;


export default function ConsentSimplifier() {
  const [isLoading, setIsLoading] = useState(false);
  const [simplifiedPoints, setSimplifiedPoints] = useState([]); // State to hold the simplified points from the API
  const [inputText, setInputText] = useState(originalConsentText);
  const resultsRef = useRef(null);

  const handleSimplifyClick = async () => {
    if (!inputText) return;
    setIsLoading(true);
    setSimplifiedPoints([]); // Clear previous results

    // API endpoint URL
    const apiUrl = 'http://127.0.0.1:8000/simplify-consent'; // Adjust the URL if your backend is running elsewhere

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consent_text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSimplifiedPoints(data.simplified_points); // Set the simplified points from the API response

    } catch (error) {
      console.error("Error simplifying consent form:", error);
      // You can add an error message state to display to the user
      alert("Failed to simplify the text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to results when they are available
    if (simplifiedPoints.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [simplifiedPoints]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6  min-h-screen">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
          AI Consent Form Simplifier
        </h1>
        <p className="text-base md:text-lg text-gray-500 mt-2">
          Making complex medical documents easy to understand.
        </p>
      </motion.header>

      
      <div className="space-y-6">
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="h-6 w-6" /> Paste Your Consent Form Here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste the complex medical text here..."
                className="w-full h-56 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button 
                onClick={handleSimplifyClick}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-base flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin h-5 w-5" />
                    Simplifying...
                  </>
                ) : (
                  <>
                    Simplify Now <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        
        <AnimatePresence>
          {simplifiedPoints.length > 0 && (
            <motion.div
              ref={resultsRef} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Card className="shadow-md bg-white border-green-300 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-green-800">
                    <CheckCircle className="h-6 w-6" /> Simplified Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  
                  <div className="space-y-3">
                    {simplifiedPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                        <div className="flex-shrink-0 mt-0.5">
                            {/* You can add logic here to choose icons based on the title if needed */}
                            {index === 0 && <Stethoscope className="h-5 w-5 text-blue-500" />}
                            {index === 1 && <Heart className="h-5 w-5 text-green-500" />}
                            {index === 2 && <AlertTriangle className="h-5 w-5 text-red-500" />}
                            {index === 3 && <Database className="h-5 w-5 text-purple-500" />}
                            {index === 4 && <ShieldCheck className="h-5 w-5 text-yellow-500" />}
                            {index > 4 && <FileText className="h-5 w-5 text-gray-500" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{point.title}</h3>
                          <p className="text-gray-600 text-sm leading-snug">{point.text}</p>
                        </div>
                      </div>
                    ))} 
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}