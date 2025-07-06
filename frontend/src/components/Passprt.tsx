import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Shield,
  Droplets,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";

const patientData = {
  personalInfo: {
    name: "Richa Singh",
    dob: "2004-11-25",
    email: "richa.singh@example.com",
    phone: "+91 98765 43210",
    address: "15, Park Street, Kolkata, West Bengal",
  },
  medicalHistory: [
    {
      date: "2025-01-10",
      diagnosis: "Annual Health Check-up",
      doctor: "Dr. Arjun Gupta",
      notes: "All vitals are normal. Advised to monitor Vitamin D levels.",
    },
    {
      date: "2024-07-22",
      diagnosis: "Viral Fever",
      doctor: "Dr. Arjun Gupta",
      notes: "Prescribed Paracetamol and advised rest for 3-5 days.",
    },
     {
      date: "2022-02-20",
      diagnosis: "Vitamin B12 Deficiency",
      doctor: "Dr. Arjun Gupta",
      notes: "Patient reported fatigue and weakness. Prescribed supplements and dietary adjustments.",
    },
  ],
  allergies: ["Sulfa Drugs", "Dust"],
  bloodType: "B+",
};

const qrCodeData = JSON.stringify({
  name: patientData.personalInfo.name,
  dob: patientData.personalInfo.dob,
  bloodType: patientData.bloodType,
  allergies: patientData.allergies,
  emergencyContact: "+1 (555) 123-4567",
});

export default function DigitalHealthPassport() {
  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-3xl font-bold text-gray-800">
          Digital Health Passport
        </CardTitle>
        <p className="text-sm text-gray-500">
          Your secure and portable medical records.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User /> Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="font-bold text-lg">
                  {patientData.personalInfo.name}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="h-4 w-4" />{" "}
                  {patientData.personalInfo.dob}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" /> {patientData.personalInfo.email}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" /> {patientData.personalInfo.phone}
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <CardHeader>
                <CardTitle className="text-xl">Medical QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                
                <QRCodeCanvas
                  id="health-qr-code"
                  value={qrCodeData}
                  size={160}
                  level={"H"}
                  includeMargin={true}
                  className="rounded-lg border-4 border-white shadow-md"
                />
                <p className="text-xs mt-3 text-gray-500">
                  Scan for emergency details.
                </p>
              </CardContent>
            </Card>
          </div>

          
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-red-50 border-red-200">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" /> Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="list-disc list-inside text-red-900">
                    {patientData.allergies.map((allergy) => (
                      <li key={allergy}>{allergy}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" /> Blood Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-2xl font-bold text-blue-900">
                    {patientData.bloodType}
                  </p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Medical History
            </h3>
            <div className="space-y-4">
              {patientData.medicalHistory.map((record, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <p className="font-bold text-md text-gray-800">
                    {record.diagnosis}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Doctor:</strong> {record.doctor}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong> {record.date}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">{record.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
