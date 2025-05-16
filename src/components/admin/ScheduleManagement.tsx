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
import { Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
type Route = Database["public"]["Tables"]["routes"]["Row"];
type Station = Database["public"]["Tables"]["stations"]["Row"];

interface RouteWithStations extends Route {
  origin: Station;
  destination: Station;
}

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<RouteWithStations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null,
  );

  // Form fields
  const [routeId, setRouteId] = useState("");
  const [date, setDate] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState("48");

  useEffect(() => {
    fetchSchedules();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("date");

      if (error) throw error;
      setSchedules(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch schedules");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      // First get all routes
      const { data: routesData, error: routesError } = await supabase
        .from("routes")
        .select("*");

      if (routesError) throw routesError;

      // Then get all stations
      const { data: stationsData, error: stationsError } = await supabase
        .from("stations")
        .select("*");

      if (stationsError) throw stationsError;

      // Combine the data
      const routesWithStations = routesData?.map((route) => {
        const origin = stationsData?.find(
          (station) => station.id === route.origin_id,
        );
        const destination = stationsData?.find(
          (station) => station.id === route.destination_id,
        );
        return {
          ...route,
          origin: origin as Station,
          destination: destination as Station,
        };
      });

      setRoutes(routesWithStations || []);
    } catch (err: any) {
      console.error("Error fetching routes:", err);
    }
  };

  const resetForm = () => {
    setRouteId("");
    setDate("");
    setSeatsAvailable("48");
    setScheduleToEdit(null);
    setError(null);
    setSuccess(null);
  };

  const handleAddSchedule = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!routeId) {
        throw new Error("Route is required");
      }

      if (!date) {
        throw new Error("Date is required");
      }

      if (
        !seatsAvailable ||
        isNaN(parseInt(seatsAvailable)) ||
        parseInt(seatsAvailable) <= 0
      ) {
        throw new Error("Seats available must be a positive number");
      }

      const { data, error } = await supabase
        .from("schedules")
        .insert({
          route_id: routeId,
          date: date,
          seats_available: parseInt(seatsAvailable),
        })
        .select();

      if (error) throw error;

      setSuccess("Schedule added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      fetchSchedules();
    } catch (err: any) {
      setError(err.message || "Failed to add schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSchedule = async () => {
    if (!scheduleToEdit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!routeId) {
        throw new Error("Route is required");
      }

      if (!date) {
        throw new Error("Date is required");
      }

      if (
        !seatsAvailable ||
        isNaN(parseInt(seatsAvailable)) ||
        parseInt(seatsAvailable) <= 0
      ) {
        throw new Error("Seats available must be a positive number");
      }

      const { error } = await supabase
        .from("schedules")
        .update({
          route_id: routeId,
          date: date,
          seats_available: parseInt(seatsAvailable),
        })
        .eq("id", scheduleToEdit.id);

      if (error) throw error;

      setSuccess("Schedule updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchSchedules();
    } catch (err: any) {
      setError(err.message || "Failed to update schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", scheduleToDelete.id);

      if (error) throw error;

      setSuccess("Schedule deleted successfully");
      setScheduleToDelete(null);
      fetchSchedules();
    } catch (err: any) {
      setError(err.message || "Failed to delete schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (schedule: Schedule) => {
    setScheduleToEdit(schedule);
    setRouteId(schedule.route_id);
    setDate(schedule.date);
    setSeatsAvailable(schedule.seats_available.toString());
    setIsEditDialogOpen(true);
  };

  const getRouteInfo = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return "Unknown Route";
    return `${route.origin?.name || "Unknown"} to ${route.destination?.name || "Unknown"}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Schedule Management</h2>
          <p className="text-gray-600">Add, edit, or remove train schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
              <DialogDescription>
                Enter the details for the new train schedule.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeId">Route *</Label>
                <Select value={routeId} onValueChange={setRouteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.origin?.name || "Unknown"} to{" "}
                        {route.destination?.name || "Unknown"} (
                        {route.departure_time})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seatsAvailable">Seats Available *</Label>
                <Input
                  id="seatsAvailable"
                  type="number"
                  value={seatsAvailable}
                  onChange={(e) => setSeatsAvailable(e.target.value)}
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
              <Button onClick={handleAddSchedule} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Schedule"
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
      ) : schedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            No schedules found. Add your first schedule to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Seats Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{getRouteInfo(schedule.route_id)}</TableCell>
                <TableCell>{formatDate(schedule.date)}</TableCell>
                <TableCell>{schedule.seats_available}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(schedule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setScheduleToDelete(schedule)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this schedule for{" "}
                            {getRouteInfo(schedule.route_id)} on{" "}
                            {formatDate(schedule.date)}? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setScheduleToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteSchedule}
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

      {/* Edit Schedule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the details for this schedule.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editRouteId">Route *</Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.origin?.name || "Unknown"} to{" "}
                      {route.destination?.name || "Unknown"} (
                      {route.departure_time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDate">Date *</Label>
              <Input
                id="editDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editSeatsAvailable">Seats Available *</Label>
              <Input
                id="editSeatsAvailable"
                type="number"
                value={seatsAvailable}
                onChange={(e) => setSeatsAvailable(e.target.value)}
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
            <Button onClick={handleEditSchedule} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;
