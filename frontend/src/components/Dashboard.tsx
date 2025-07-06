import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Calendar,
  Clock,
  Droplet,
  Heart,
  Hospital,
  Stethoscope,
  User,
  FileText,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { Button } from "./ui/button";
import DietPlanForm from "./Diet";
import AppointmentForm from "./Appointment";
import DigitalHealthPassport from "./Passprt";

const healthData = {
  heartRate: { value: "72 bpm", status: "normal" },
  bloodPressure: { value: "120/80", status: "normal" },
  spO2: { value: "98%", status: "good" },
  steps: { value: "8,547", status: "active" },
};

const appointments = [
  {
    doctor: "Dr. Mayank Kashyap",
    specialty: "Cardiologist",
    date: "Tomorrow, 10:00 AM",
  },
  {
    doctor: "Dr. Shreya Sharma",
    specialty: "Neurologist",
    date: "Friday, 2:30 PM",
  },
];

export default function Dashboard() {
  return (
    <div className="w-full mx-auto p-6 max-w-screen-lg">
     
      <header className="flex justify-between items-center mb-8">
        <img className="w-[150px]" src="/haha.png" alt="" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-gray-500">Monitor your health and appointments</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link to="/insurance">
            <Button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600">
              <ShieldCheck className="h-5 w-5" />
              Health Insurance
            </Button>
          </Link>

          <Link to="/report">
            <Button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600">
              <FileText className="h-5 w-5" />
              Medical Reports
            </Button>
          </Link>

          <Link to="/recommend">
            <Button className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600">
              <FileText className="h-5 w-5" />
              Govt. Schemes
            </Button>
          </Link>

          <Link to="/consent-simplifier">
            <Button className="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-600">
              <BrainCircuit className="h-5 w-5" />
              Consent Simplifier
            </Button>
          </Link>
        </div>
      </header>

      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100 p-2 rounded-lg">
          <TabsTrigger
            value="overview"
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="passport"
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Digital Health Passport
          </TabsTrigger>
         
          <TabsTrigger
            value="diet"
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Diet Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            <TooltipProvider>
              {Object.entries(healthData).map(([key, { value, status }]) => (
                <Card
                  key={key}
                  className="bg-white/80 shadow-md backdrop-blur-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        {key === "heartRate" ? (
                          <Heart className="h-5 w-5 text-red-500" />
                        ) : key === "bloodPressure" ? (
                          <Activity className="h-5 w-5 text-blue-500" />
                        ) : key === "spO2" ? (
                          <Stethoscope className="h-5 w-5 text-green-500" />
                        ) : (
                          <User className="h-5 w-5 text-purple-500" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white p-2 rounded-md">
                        Status: {status}
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                  </CardContent>
                </Card>
              ))}
            </TooltipProvider>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((apt, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{apt.doctor}</p>
                          <p className="text-sm text-gray-500">
                            {apt.specialty} • {apt.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="w-full flex justify-center p-4">
                <AppointmentForm />
              </div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hospital className="h-5 w-5" /> Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Disease Detection",
                        icon: <Stethoscope className="h-6 w-6" />,
                        path: "/disease-detection",
                      },
                      {
                        label: "Chat Assistant",
                        icon: <Bot className="h-6 w-6" />,
                        path: "/chatbot",
                      },
                      {
                        label: "Hospital Beds",
                        icon: <Hospital className="h-6 w-6" />,
                        path: "/hospital-beds",
                      },
                      {
                        label: "Blood Donors",
                        icon: <Droplet className="h-6 w-6" />,
                        path: "/blood-donor",
                      },
                    ].map(({ label, icon, path }, index) => (
                      <Link to={path} key={index}>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col gap-2 text-black hover:bg-gray-100 transition-all w-full"
                        >
                          {icon} {label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        <TabsContent value="passport">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DigitalHealthPassport />
          </motion.div>
        </TabsContent>

        <TabsContent value="diet">
          <DietPlanForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
