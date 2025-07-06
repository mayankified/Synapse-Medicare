import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash, Edit, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Bed {
  id: string;
  room: string;
  patient?: string;
  status: "Available" | "Occupied" | "Maintenance";
}

export function BedManagement() {
  const [beds, setBeds] = useState<Bed[]>([
    { id: "B101", room: "101", patient: "Dr Ravikant", status: "Occupied" },
    { id: "B102", room: "102", patient: undefined, status: "Available" },
    { id: "B103", room: "103", patient: "Harshil Mahato", status: "Occupied" },
    { id: "B104", room: "104", patient: undefined, status: "Maintenance" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [bedForm, setBedForm] = useState<Bed>({ id: "", room: "", status: "Available" });

  const openDialog = (bed?: Bed) => {
    if (bed) {
      setEditingBed(bed);
      setBedForm(bed);
    } else {
      setEditingBed(null);
      setBedForm({ id: "", room: "", status: "Available" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!bedForm.id || !bedForm.room) {
      toast({ title: "Error", description: "Bed ID and Room are required.", variant: "destructive" });
      return;
    }

    if (editingBed) {
      setBeds((prevBeds) =>
        prevBeds.map((b) => (b.id === editingBed.id ? { ...bedForm } : b))
      );
      toast({ title: "Updated", description: "Bed details updated successfully." });
    } else {
      setBeds([...beds, bedForm]);
      toast({ title: "Added", description: "New bed added successfully." });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setBeds(beds.filter((b) => b.id !== id));
    toast({ title: "Deleted", description: "Bed removed successfully." });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Hospital Bed Management</CardTitle>
          <Button onClick={() => openDialog()}><Plus className="w-4 h-4 mr-2" /> Add Bed</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed ID</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell>{bed.id}</TableCell>
                  <TableCell>{bed.room}</TableCell>
                  <TableCell>{bed.patient || "Unassigned"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        bed.status === "Available"
                          ? "bg-green-500"
                          : bed.status === "Occupied"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {bed.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => openDialog(bed)} variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(bed.id)} variant="destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Bed Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBed ? "Edit Bed" : "Add Bed"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Bed ID</label>
              <Input
                value={bedForm.id}
                onChange={(e) => setBedForm({ ...bedForm, id: e.target.value })}
                placeholder="Enter Bed ID"
                disabled={!!editingBed}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Room Number</label>
              <Input
                value={bedForm.room}
                onChange={(e) => setBedForm({ ...bedForm, room: e.target.value })}
                placeholder="Enter Room Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Assign Patient</label>
              <Input
                value={bedForm.patient || ""}
                onChange={(e) => setBedForm({ ...bedForm, patient: e.target.value })}
                placeholder="Enter Patient Name (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                value={bedForm.status}
                onChange={(e) => setBedForm({ ...bedForm, status: e.target.value as Bed["status"] })}
                className="border p-2 rounded w-full"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{editingBed ? "Update Bed" : "Add Bed"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
