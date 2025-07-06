import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Appointment {
  id?: string;
  patientName: string;
  phone?: string;
  doctorName: string;
  date: Date;
  time: string;
  type: "checkup" | "followup" | "emergency" | "surgery";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

const doctors = [
  { id: "1", name: "Dr. Rajeev Mehta", specialty: "General Medicine" },
  { id: "2", name: "Dr. Priyanka Iyer", specialty: "Orthopedics" },
  { id: "3", name: "Dr. Vikas Menon", specialty: "Surgery" },
  { id: "4", name: "Dr. Pooja Desai", specialty: "Pediatrics" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [date, setDate] = useState<Date>();
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    type: "checkup",
    status: "scheduled",
  });

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Appointment[] = snapshot.docs.map((doc) => {
        const appt = doc.data();
        return {
          id: doc.id,
          patientName: appt.patientName,
          phone: appt.phone,
          doctorName: appt.doctorName,
          date: new Date(appt.date),
          time: appt.time,
          type: appt.type,
          status: appt.status,
          notes: appt.notes || "",
        };
      });
      setAppointments(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateAppointment = async () => {
    const { patientName, phone, doctorName, time } = newAppointment;
    if (patientName && phone && doctorName && date && time) {
      const appointmentData = {
        patientName,
        phone,
        doctorName,
        date: date.toISOString(),
        time,
        type: newAppointment.type || "checkup",
        status: newAppointment.status || "scheduled",
        notes: newAppointment.notes || "",
        createdAt: new Date().toISOString(),
      };
      try {
        await addDoc(collection(db, "appointments"), appointmentData);
        alert("✅ Appointment successfully scheduled!");
        setIsAddingAppointment(false);
        setNewAppointment({ type: "checkup", status: "scheduled" });
        setDate(undefined);
      } catch (error) {
        console.error("Error saving appointment:", error);
        alert("❌ Error scheduling appointment. Please try again.");
      }
    } else {
      alert("⚠️ Please fill in all the required fields.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage scheduled appointments</p>
        </div>
        <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Fill in the details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Patient Name"
                value={newAppointment.patientName || ""}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={newAppointment.phone || ""}
                onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
              />
              <Select
                value={newAppointment.doctorName}
                onValueChange={(value) => setNewAppointment({ ...newAppointment, doctorName: value })}
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
                      className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select
                  value={newAppointment.time}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}
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
                placeholder="Notes (optional)"
                value={newAppointment.notes || ""}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              />
              <Button onClick={handleCreateAppointment} className="w-full">
                Schedule Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search appointments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div>{appointment.patientName}</div>
                <div className="text-xs text-muted-foreground">{appointment.phone}</div>
              </TableCell>
              <TableCell>{appointment.doctorName}</TableCell>
              <TableCell>{format(appointment.date, "PPP")} at {appointment.time}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>{appointment.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}