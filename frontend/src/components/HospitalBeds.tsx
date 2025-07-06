import { useState } from "react";
import { Search, MapPin, Navigation, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// 🔹 Surat hospital data
const hospitals = [
  {
    id: 1,
    name: "SMIMER Hospital",
    distance: "3.2 km",
    phone: "+91 261 223 1111",
    beds: {
      icu: { total: 40, available: 6 },
      general: { total: 250, available: 50 },
      emergency: { total: 15, available: 3 },
    },
    location: "Udhna Darwaja, Surat",
  },
  {
    id: 2,
    name: "New Civil Hospital",
    distance: "5.1 km",
    phone: "+91 261 220 8888",
    beds: {
      icu: { total: 60, available: 8 },
      general: { total: 300, available: 100 },
      emergency: { total: 25, available: 5 },
    },
    location: "Majura Gate, Surat",
  },
  {
    id: 3,
    name: "Kiran Multi Super Specialty Hospital",
    distance: "7.5 km",
    phone: "+91 261 677 6777",
    beds: {
      icu: { total: 50, available: 10 },
      general: { total: 200, available: 40 },
      emergency: { total: 10, available: 2 },
    },
    location: "Katargam, Surat",
  },
  {
    id: 4,
    name: "Apple Hospital",
    distance: "4.3 km",
    phone: "+91 261 233 5678",
    beds: {
      icu: { total: 30, available: 2 },
      general: { total: 150, available: 30 },
      emergency: { total: 12, available: 1 },
    },
    location: "Varachha, Surat",
  },
];

export default function SuratHospitalBeds() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Surat Hospital Bed Availability</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredHospitals.length === 0 ? (
                <p className="text-center text-muted-foreground">No hospitals found</p>
              ) : (
                filteredHospitals.map((hospital) => (
                  <Card key={hospital.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{hospital.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            {hospital.location}
                            <span className="text-sm">({hospital.distance})</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">ICU Beds</div>
                          <div className="flex items-center gap-2">
                            <Badge variant={hospital.beds.icu.available > 0 ? "default" : "destructive"}>
                              {hospital.beds.icu.available} Available
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              of {hospital.beds.icu.total}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">General Beds</div>
                          <div className="flex items-center gap-2">
                            <Badge variant={hospital.beds.general.available > 0 ? "default" : "destructive"}>
                              {hospital.beds.general.available} Available
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              of {hospital.beds.general.total}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Emergency Beds</div>
                          <div className="flex items-center gap-2">
                            <Badge variant={hospital.beds.emergency.available > 0 ? "default" : "destructive"}>
                              {hospital.beds.emergency.available} Available
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              of {hospital.beds.emergency.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
