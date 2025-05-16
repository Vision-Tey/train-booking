import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Search } from "lucide-react";

interface TicketSearchFormProps {
  onSearch?: (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
    passengers: number;
  }) => void;
  initialValues?: {
    origin: string;
    destination: string;
    date: Date | undefined;
    passengers: number;
  };
  compact?: boolean;
}

const TicketSearchForm = ({
  onSearch = () => {},
  initialValues,
  compact = false,
}: TicketSearchFormProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState<number>(1);
  const [error, setError] = useState<string>("");

  // Initialize form with initial values if provided
  useEffect(() => {
    if (initialValues) {
      setOrigin(initialValues.origin || "");
      setDestination(initialValues.destination || "");
      setDate(initialValues.date);
      setPassengers(initialValues.passengers || 1);
    }
  }, [initialValues]);

  const stations = [
    "Kampala Central",
    "Entebbe",
    "Jinja",
    "Mbarara",
    "Gulu",
    "Mbale",
    "Kasese",
    "Soroti",
    "Arua",
    "Fort Portal",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!origin) {
      setError("Please select an origin station");
      return;
    }

    if (!destination) {
      setError("Please select a destination station");
      return;
    }

    if (origin === destination) {
      setError("Origin and destination stations cannot be the same");
      return;
    }

    if (!date) {
      setError("Please select a travel date");
      return;
    }

    onSearch({ origin, destination, date, passengers });
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-6 rounded-xl shadow-lg bg-white ${compact ? "shadow-sm" : "shadow-lg"}`}
    >
      {!compact && (
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Find Your Train
        </h2>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`space-y-${compact ? "4" : "6"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin Station</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger id="origin" className="cursor-pointer">
                <SelectValue placeholder="Select departure station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination Station</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination" className="cursor-pointer">
                <SelectValue placeholder="Select arrival station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal cursor-pointer"
                  id="date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    // Only disable dates in the past (before today)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers">Number of Passengers</Label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-2"
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
              >
                -
              </Button>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="10"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                className="mx-2 text-center"
              />
              <Button
                type="button"
                variant="outline"
                className="h-9 px-2"
                onClick={() => setPassengers(Math.min(10, passengers + 1))}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full py-6 text-lg font-semibold">
          <Search className="mr-2 h-5 w-5" />
          Search Trains
        </Button>
      </form>
    </div>
  );
};

export default TicketSearchForm;
