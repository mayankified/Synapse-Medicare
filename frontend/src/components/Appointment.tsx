
import { collection, addDoc } from "firebase/firestore";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { db } from "@/config/firebase";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  doctorName: string;
  date: Date;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

const doctors = [
  { id: "1", name: "Dr. Rajeev Mehta", specialty: "General Medicine" },
  { id: "2", name: "Dr. Priyanka Iyer", specialty: "Orthopedics" },
  { id: "3", name: "Dr. Vikas Menon", specialty: "Surgery" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export default function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    type: "checkup",
    status: "scheduled",
  });

const handleCreateAppointment = async () => {
  const { patientName, phone, doctorName, time } = newAppointment;

  if (patientName && phone && doctorName && date && time) {
    const appointment = {
      patientName,
      phone,
      doctorName,
      date: date.toISOString(), 
      time,
      type: "checkup",
      status: "scheduled",
      notes: newAppointment.notes || "",
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "appointments"), appointment); 
      console.log("Appointment saved to Firebase:", appointment);
      alert("Appointment successfully scheduled!");
const formattedDate = format(date, "PPP");
      const message = `Hello ${patientName}, your appointment with ${doctorName} is scheduled on ${formattedDate} at ${time}.`;

      await fetch("https://twilio-back.onrender.com/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `+91${phone}`,
          message,
        }),
      });

      setIsOpen(false);
      setNewAppointment({});
      setDate(undefined);
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Error scheduling appointment. Please try again.");
    }
  } else {
    alert("Please fill in all the required fields.");
  }
};

  return (
    <>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Book Appointment
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the appointment details below to schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Patient Name"
              value={newAppointment.patientName || ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, patientName: e.target.value })
              }
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={newAppointment.phone || ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, phone: e.target.value })
              }
            />

            <Select
              value={newAppointment.doctorName}
              onValueChange={(value) =>
                setNewAppointment({ ...newAppointment, doctorName: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.name}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={!date ? "text-muted-foreground" : ""}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={newAppointment.time}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, time: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Notes (Optional)"
              value={newAppointment.notes || ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, notes: e.target.value })
              }
            />

            <Button onClick={handleCreateAppointment} className="w-full">
              Schedule Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
