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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Route = Database["public"]["Tables"]["routes"]["Row"];
type Station = Database["public"]["Tables"]["stations"]["Row"];
type Train = Database["public"]["Tables"]["trains"]["Row"];

const RouteManagement: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  // Form fields
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [trainId, setTrainId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchRoutes();
    fetchStations();
    fetchTrains();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from("routes").select("*");

      if (error) throw error;
      setRoutes(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch routes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .order("name");

      if (error) throw error;
      setStations(data || []);
    } catch (err: any) {
      console.error("Error fetching stations:", err);
    }
  };

  const fetchTrains = async () => {
    try {
      const { data, error } = await supabase
        .from("trains")
        .select("*")
        .order("train_number");

      if (error) throw error;
      setTrains(data || []);
    } catch (err: any) {
      console.error("Error fetching trains:", err);
    }
  };

  const resetForm = () => {
    setOriginId("");
    setDestinationId("");
    setTrainId("");
    setDepartureTime("");
    setArrivalTime("");
    setDuration("");
    setPrice("");
    setRouteToEdit(null);
    setError(null);
    setSuccess(null);
  };

  const handleAddRoute = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (
        !originId ||
        !destinationId ||
        !trainId ||
        !departureTime ||
        !arrivalTime ||
        !duration ||
        !price
      ) {
        throw new Error("All fields are required");
      }

      if (originId === destinationId) {
        throw new Error("Origin and destination cannot be the same");
      }

      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        throw new Error("Price must be a positive number");
      }

      const { data, error } = await supabase
        .from("routes")
        .insert({
          origin_id: originId,
          destination_id: destinationId,
          train_id: trainId,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          duration: duration,
          price: parseFloat(price),
        })
        .select();

      if (error) throw error;

      setSuccess("Route added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      fetchRoutes();
    } catch (err: any) {
      setError(err.message || "Failed to add route");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRoute = async () => {
    if (!routeToEdit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (
        !originId ||
        !destinationId ||
        !trainId ||
        !departureTime ||
        !arrivalTime ||
        !duration ||
        !price
      ) {
        throw new Error("All fields are required");
      }

      if (originId === destinationId) {
        throw new Error("Origin and destination cannot be the same");
      }

      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        throw new Error("Price must be a positive number");
      }

      const { error } = await supabase
        .from("routes")
        .update({
          origin_id: originId,
          destination_id: destinationId,
          train_id: trainId,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          duration: duration,
          price: parseFloat(price),
        })
        .eq("id", routeToEdit.id);

      if (error) throw error;

      setSuccess("Route updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchRoutes();
    } catch (err: any) {
      setError(err.message || "Failed to update route");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoute = async () => {
    if (!routeToDelete) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("routes")
        .delete()
        .eq("id", routeToDelete.id);

      if (error) throw error;

      setSuccess("Route deleted successfully");
      setRouteToDelete(null);
      fetchRoutes();
    } catch (err: any) {
      setError(err.message || "Failed to delete route");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (route: Route) => {
    setRouteToEdit(route);
    setOriginId(route.origin_id);
    setDestinationId(route.destination_id);
    setTrainId(route.train_id);
    setDepartureTime(route.departure_time);
    setArrivalTime(route.arrival_time);
    setDuration(route.duration);
    setPrice(route.price.toString());
    setIsEditDialogOpen(true);
  };

  const getStationName = (stationId: string) => {
    const station = stations.find((s) => s.id === stationId);
    return station ? station.name : "Unknown";
  };

  const getTrainNumber = (trainId: string) => {
    const train = trains.find((t) => t.id === trainId);
    return train ? train.train_number : "Unknown";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Route Management</h2>
          <p className="text-gray-600">Add, edit, or remove train routes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Route</DialogTitle>
              <DialogDescription>
                Enter the details for the new train route.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originId">Origin Station *</Label>
                  <Select value={originId} onValueChange={setOriginId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationId">Destination Station *</Label>
                  <Select
                    value={destinationId}
                    onValueChange={setDestinationId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainId">Train *</Label>
                <Select value={trainId} onValueChange={setTrainId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select train" />
                  </SelectTrigger>
                  <SelectContent>
                    {trains.map((train) => (
                      <SelectItem key={train.id} value={train.id}>
                        {train.train_number}{" "}
                        {train.name ? `(${train.name})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Time *</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Time *</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2h 30m"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (UGX) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="1"
                    step="1000"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRoute} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Route"
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
      ) : routes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            No routes found. Add your first route to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Train</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price (UGX)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{getStationName(route.origin_id)}</TableCell>
                <TableCell>{getStationName(route.destination_id)}</TableCell>
                <TableCell>{getTrainNumber(route.train_id)}</TableCell>
                <TableCell>{route.departure_time}</TableCell>
                <TableCell>{route.arrival_time}</TableCell>
                <TableCell>{route.duration}</TableCell>
                <TableCell>{route.price.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(route)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setRouteToDelete(route)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Route</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the route from{" "}
                            {getStationName(route.origin_id)} to{" "}
                            {getStationName(route.destination_id)}? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setRouteToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteRoute}
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

      {/* Edit Route Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update the details for this route.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editOriginId">Origin Station *</Label>
                <Select value={originId} onValueChange={setOriginId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDestinationId">Destination Station *</Label>
                <Select value={destinationId} onValueChange={setDestinationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTrainId">Train *</Label>
              <Select value={trainId} onValueChange={setTrainId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {trains.map((train) => (
                    <SelectItem key={train.id} value={train.id}>
                      {train.train_number} {train.name ? `(${train.name})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDepartureTime">Departure Time *</Label>
                <Input
                  id="editDepartureTime"
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editArrivalTime">Arrival Time *</Label>
                <Input
                  id="editArrivalTime"
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDuration">Duration *</Label>
                <Input
                  id="editDuration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2h 30m"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPrice">Price (UGX) *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  step="1000"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditRoute} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Route"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RouteManagement;
