import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus } from "lucide-react";

// 🔹 Indian patient data
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  bloodType: string;
  status: "active" | "discharged" | "critical";
  lastVisit: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Amit Sharma",
    age: 42,
    gender: "male",
    phone: "+91 98765 43210",
    email: "amit.sharma@email.com",
    bloodType: "O+",
    status: "active",
    lastVisit: "2024-03-18",
  },
  {
    id: "2",
    name: "Neha Patel",
    age: 35,
    gender: "female",
    phone: "+91 98654 32109",
    email: "neha.patel@email.com",
    bloodType: "A-",
    status: "critical",
    lastVisit: "2024-03-15",
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    age: 50,
    gender: "male",
    phone: "+91 97845 65432",
    email: "rajesh.kumar@email.com",
    bloodType: "B+",
    status: "discharged",
    lastVisit: "2024-03-12",
  },
  {
    id: "4",
    name: "Priya Iyer",
    age: 29,
    gender: "female",
    phone: "+91 96543 21098",
    email: "priya.iyer@email.com",
    bloodType: "AB+",
    status: "active",
    lastVisit: "2024-03-20",
  },
];

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    gender: "male",
    status: "active",
  });

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.phone && newPatient.email) {
      const patient: Patient = {
        id: (patients.length + 1).toString(),
        name: newPatient.name,
        age: Number(newPatient.age),
        gender: newPatient.gender as "male" | "female" | "other",
        phone: newPatient.phone,
        email: newPatient.email,
        bloodType: newPatient.bloodType || "Unknown",
        status: newPatient.status as "active" | "discharged" | "critical",
        lastVisit: new Date().toISOString().split("T")[0],
      };
      setPatients([...patients, patient]);
      setIsAddingPatient(false);
      setNewPatient({
        gender: "male",
        status: "active",
      });
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "critical":
        return "text-red-500";
      case "discharged":
        return "text-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Enter the patient's information below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Full Name"
                value={newPatient.name || ""}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Age"
                  value={newPatient.age || ""}
                  onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                />
                <Select
                  value={newPatient.gender}
                  // @ts-ignore
                  onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Phone Number"
                value={newPatient.phone || ""}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newPatient.email || ""}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Blood Type"
                  value={newPatient.bloodType || ""}
                  onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                />
                <Select
                  value={newPatient.status}
                  // @ts-ignore
                  onValueChange={(value) => setNewPatient({ ...newPatient, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddPatient} className="w-full">
                Add Patient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{patient.bloodType}</TableCell>
              <TableCell className={`capitalize font-medium ${getStatusColor(patient.status)}`}>
                {patient.status}
              </TableCell>
              <TableCell>{patient.lastVisit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
