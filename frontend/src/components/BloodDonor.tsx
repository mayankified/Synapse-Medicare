import { useState } from "react";
import { Search, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🔹 Indian blood donor data
const donors = [
  {
    id: 1,
    name: "Ravi Sharma",
    bloodType: "A+",
    location: "Surat",
    lastDonation: "2024-01-15",
    contact: {
      phone: "+91 98765 43210",
      email: "ravi.sharma@email.com",
    },
    available: true,
  },
  {
    id: 2,
    name: "Anjali Patel",
    bloodType: "O-",
    location: "Ahmedabad",
    lastDonation: "2024-02-01",
    contact: {
      phone: "+91 98654 32109",
      email: "anjali.patel@email.com",
    },
    available: true,
  },
  {
    id: 3,
    name: "Vikram Singh",
    bloodType: "B+",
    location: "Vadodara",
    lastDonation: "2024-01-20",
    contact: {
      phone: "+91 97845 65432",
      email: "vikram.singh@email.com",
    },
    available: false,
  },
  {
    id: 4,
    name: "Meera Desai",
    bloodType: "AB+",
    location: "Mumbai",
    lastDonation: "2024-03-05",
    contact: {
      phone: "+91 96543 21098",
      email: "meera.desai@email.com",
    },
    available: true,
  },
  {
    id: 5,
    name: "Rahul Verma",
    bloodType: "O+",
    location: "Delhi",
    lastDonation: "2024-01-10",
    contact: {
      phone: "+91 99876 54321",
      email: "rahul.verma@email.com",
    },
    available: true,
  },
  {
    id: 6,
    name: "Sanya Iyer",
    bloodType: "B-",
    location: "Chennai",
    lastDonation: "2023-12-28",
    contact: {
      phone: "+91 98765 09876",
      email: "sanya.iyer@email.com",
    },
    available: false,
  },
];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodDonor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = !selectedBloodType || donor.bloodType === selectedBloodType;
    return matchesSearch && matchesBloodType;
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Blood Donor Directory (India)</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donors or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedBloodType || "all"}
              onValueChange={(value) => setSelectedBloodType(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => (
                  <Card key={donor.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{donor.name}</h3>
                            <Badge variant={donor.available ? "default" : "secondary"}>
                              {donor.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{donor.location}</p>
                        </div>
                        <Badge variant="outline" className="text-lg">
                          {donor.bloodType}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Last donation: {new Date(donor.lastDonation).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Phone className="h-4 w-4" />
                            {donor.contact.phone}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Mail className="h-4 w-4" />
                            {donor.contact.email}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">No donors found for the selected criteria.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
