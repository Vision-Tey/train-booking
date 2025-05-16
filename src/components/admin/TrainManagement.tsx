import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Train = Database["public"]["Tables"]["trains"]["Row"];

const TrainManagement: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [trainToEdit, setTrainToEdit] = useState<Train | null>(null);
  const [trainToDelete, setTrainToDelete] = useState<Train | null>(null);

  // Form fields
  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [capacity, setCapacity] = useState("48");

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("trains")
        .select("*")
        .order("train_number");

      if (error) throw error;
      setTrains(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch trains");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTrainNumber("");
    setTrainName("");
    setCapacity("48");
    setTrainToEdit(null);
    setError(null);
    setSuccess(null);
  };

  const handleAddTrain = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!trainNumber) {
        throw new Error("Train number is required");
      }

      if (!capacity || isNaN(parseInt(capacity)) || parseInt(capacity) <= 0) {
        throw new Error("Capacity must be a positive number");
      }

      const { data, error } = await supabase
        .from("trains")
        .insert({
          train_number: trainNumber,
          name: trainName || null,
          capacity: parseInt(capacity),
        })
        .select();

      if (error) throw error;

      setSuccess("Train added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      fetchTrains();
    } catch (err: any) {
      setError(err.message || "Failed to add train");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTrain = async () => {
    if (!trainToEdit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!trainNumber) {
        throw new Error("Train number is required");
      }

      if (!capacity || isNaN(parseInt(capacity)) || parseInt(capacity) <= 0) {
        throw new Error("Capacity must be a positive number");
      }

      const { error } = await supabase
        .from("trains")
        .update({
          train_number: trainNumber,
          name: trainName || null,
          capacity: parseInt(capacity),
        })
        .eq("id", trainToEdit.id);

      if (error) throw error;

      setSuccess("Train updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchTrains();
    } catch (err: any) {
      setError(err.message || "Failed to update train");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrain = async () => {
    if (!trainToDelete) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("trains")
        .delete()
        .eq("id", trainToDelete.id);

      if (error) throw error;

      setSuccess("Train deleted successfully");
      setTrainToDelete(null);
      fetchTrains();
    } catch (err: any) {
      setError(err.message || "Failed to delete train");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (train: Train) => {
    setTrainToEdit(train);
    setTrainNumber(train.train_number);
    setTrainName(train.name || "");
    setCapacity(train.capacity.toString());
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Train Management</h2>
          <p className="text-gray-600">Add, edit, or remove trains</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Train
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Train</DialogTitle>
              <DialogDescription>
                Enter the details for the new train.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trainNumber">Train Number *</Label>
                <Input
                  id="trainNumber"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  placeholder="e.g. UGR 1001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainName">Train Name (Optional)</Label>
                <Input
                  id="trainName"
                  value={trainName}
                  onChange={(e) => setTrainName(e.target.value)}
                  placeholder="e.g. Kampala Express"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTrain} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Train"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200 mb-4">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : trains.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            No trains found. Add your first train to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trains.map((train) => (
              <TableRow key={train.id}>
                <TableCell className="font-medium">
                  {train.train_number}
                </TableCell>
                <TableCell>{train.name || "-"}</TableCell>
                <TableCell>{train.capacity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(train)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setTrainToDelete(train)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Train</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete train{" "}
                            {train.train_number}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setTrainToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteTrain}
                            className="bg-red-500 hover:bg-red-700"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Train Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Train</DialogTitle>
            <DialogDescription>
              Update the details for this train.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTrainNumber">Train Number *</Label>
              <Input
                id="editTrainNumber"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g. UGR 1001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTrainName">Train Name (Optional)</Label>
              <Input
                id="editTrainName"
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                placeholder="e.g. Kampala Express"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCapacity">Capacity *</Label>
              <Input
                id="editCapacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTrain} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Train"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainManagement;
