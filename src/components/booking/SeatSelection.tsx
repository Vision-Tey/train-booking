import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrainResult } from "../search/TrainResults";
import { Check, X, Train } from "lucide-react";

interface SeatSelectionProps {
  train: TrainResult;
  passengers: number;
  onConfirmSeats: (selectedSeats: string[]) => void;
  onCancel: () => void;
}

interface SeatMap {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
  type: "window" | "aisle" | "middle" | "priority" | "standard";
  coach: string;
  position: "left" | "right" | "center";
}

const SeatSelection = ({
  train,
  passengers = 1,
  onConfirmSeats,
  onCancel,
}: SeatSelectionProps) => {
  // Generate a realistic seat map for the train based on a 2-2 configuration
  const generateSeatMap = () => {
    const seatMap: SeatMap[] = [];
    const coaches = ["A", "B"];

    // Create a set of unavailable seats (randomly for demo)
    const unavailableSeats = new Set();
    const totalSeats = 48; // Total seats across all coaches (6 rows × 4 seats × 2 coaches)
    const unavailableCount = totalSeats - train.seatsAvailable;

    while (unavailableSeats.size < unavailableCount) {
      const randomSeat = Math.floor(Math.random() * totalSeats) + 1;
      unavailableSeats.add(randomSeat);
    }

    let seatCounter = 1;

    // Generate seats for each coach
    coaches.forEach((coach) => {
      // Each coach has 6 rows with 2 seats on each side
      for (let row = 1; row <= 6; row++) {
        // Left side - window seat (A)
        seatMap.push({
          id: `${coach}${row}A`,
          number: `${row}A`,
          coach: coach,
          isAvailable: !unavailableSeats.has(seatCounter++),
          isSelected: false,
          type: "window",
          position: "left",
        });

        // Left side - aisle seat (B)
        seatMap.push({
          id: `${coach}${row}B`,
          number: `${row}B`,
          coach: coach,
          isAvailable: !unavailableSeats.has(seatCounter++),
          isSelected: false,
          type: "aisle",
          position: "left",
        });

        // Right side - aisle seat (C)
        seatMap.push({
          id: `${coach}${row}C`,
          number: `${row}C`,
          coach: coach,
          isAvailable: !unavailableSeats.has(seatCounter++),
          isSelected: false,
          type: "aisle",
          position: "right",
        });

        // Right side - window seat (D)
        seatMap.push({
          id: `${coach}${row}D`,
          number: `${row}D`,
          coach: coach,
          isAvailable: !unavailableSeats.has(seatCounter++),
          isSelected: false,
          type: "window",
          position: "right",
        });

        // Add priority seats for first row
        if (row === 1) {
          seatMap[seatMap.length - 4].type = "priority";
          seatMap[seatMap.length - 1].type = "priority";
        }
      }
    });

    return seatMap;
  };

  const [seats, setSeats] = useState<SeatMap[]>(generateSeatMap());
  const [error, setError] = useState<string>("");
  const [selectedCoach, setSelectedCoach] = useState<string>("A");

  const selectedSeats = seats.filter((seat) => seat.isSelected);
  const coachSeats = seats.filter((seat) => seat.coach === selectedCoach);

  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          // If seat is not available, don't change anything
          if (!seat.isAvailable) return seat;

          // If seat is already selected, deselect it
          if (seat.isSelected) {
            return { ...seat, isSelected: false };
          }

          // If trying to select more seats than passengers, show error
          if (selectedSeats.length >= passengers && !seat.isSelected) {
            setError(
              `You can only select ${passengers} seat${passengers !== 1 ? "s" : ""}.`,
            );
            return seat;
          }

          // Otherwise, select the seat
          setError("");
          return { ...seat, isSelected: true };
        }
        return seat;
      }),
    );
  };

  const handleConfirm = () => {
    if (selectedSeats.length < passengers) {
      setError(
        `Please select ${passengers} seat${passengers !== 1 ? "s" : ""}.`,
      );
      return;
    }

    onConfirmSeats(selectedSeats.map((seat) => `${seat.coach}-${seat.number}`));
  };

  const getSeatColor = (seat: SeatMap) => {
    if (seat.isSelected) return "bg-primary text-white border-primary";
    if (!seat.isAvailable)
      return "bg-gray-200 text-gray-400 cursor-not-allowed";

    switch (seat.type) {
      case "window":
        return "bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400";
      case "aisle":
        return "bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400";
      case "priority":
        return "bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-400";
      default:
        return "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-400";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Train className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-bold">Select Your Seats</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{train.trainNumber}</h3>
            <p className="text-gray-600">
              {train.origin} to {train.destination}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              {train.departureTime} - {train.arrivalTime}
            </p>
            <p className="text-gray-600">{train.duration}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <p>
            Please select {passengers} seat{passengers !== 1 ? "s" : ""}
          </p>
          <p className="font-medium">
            {selectedSeats.length} of {passengers} selected
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 border border-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-center mb-6 space-x-4">
          {["A", "B"].map((coach) => (
            <Button
              key={coach}
              variant={selectedCoach === coach ? "default" : "outline"}
              onClick={() => setSelectedCoach(coach)}
              className="w-32 py-2"
            >
              Coach {coach === "A" ? "Economy" : "Business"}
            </Button>
          ))}
        </div>

        <div className="relative mb-8 border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
          {/* Train car visualization */}
          <div className="w-full h-16 bg-primary/20 rounded-t-xl mb-8 flex items-center justify-center border-b-2 border-primary">
            <Train className="h-8 w-8 text-primary" />
            <span className="ml-2 font-semibold">
              Coach {selectedCoach} -{" "}
              {selectedCoach === "A" ? "Economy" : "Business"} Class
            </span>
          </div>

          {/* Seat grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left side (seats A-B) */}
            <div className="border-r border-dashed border-gray-300 pr-4">
              <div className="text-center mb-2 font-medium text-gray-700">
                Left Side
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, rowIndex) => {
                  const rowNumber = rowIndex + 1;
                  return [
                    // Window seat (A)
                    coachSeats.find((s) => s.number === `${rowNumber}A`),
                    // Aisle seat (B)
                    coachSeats.find((s) => s.number === `${rowNumber}B`),
                  ].map((seat, seatIndex) => {
                    if (!seat) return null;
                    return (
                      <button
                        key={seat.id}
                        className={`h-12 rounded-md flex items-center justify-center border ${getSeatColor(seat)}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={!seat.isAvailable}
                        aria-label={`Seat ${seat.number} ${seat.isAvailable ? "available" : "unavailable"}`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{seat.number}</span>
                          {seat.isSelected && (
                            <Check className="h-4 w-4 mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  });
                })}
              </div>
            </div>

            {/* Right side (seats C-D) */}
            <div className="pl-4">
              <div className="text-center mb-2 font-medium text-gray-700">
                Right Side
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, rowIndex) => {
                  const rowNumber = rowIndex + 1;
                  return [
                    // Aisle seat (C)
                    coachSeats.find((s) => s.number === `${rowNumber}C`),
                    // Window seat (D)
                    coachSeats.find((s) => s.number === `${rowNumber}D`),
                  ].map((seat, seatIndex) => {
                    if (!seat) return null;
                    return (
                      <button
                        key={seat.id}
                        className={`h-12 rounded-md flex items-center justify-center border ${getSeatColor(seat)}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={!seat.isAvailable}
                        aria-label={`Seat ${seat.number} ${seat.isAvailable ? "available" : "unavailable"}`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{seat.number}</span>
                          {seat.isSelected && (
                            <Check className="h-4 w-4 mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  });
                })}
              </div>
            </div>
          </div>

          {/* Direction indicators */}
          <div className="flex justify-between mt-6 text-sm font-medium text-gray-600 bg-gray-100 p-2 rounded-md">
            <div>◀ {train.origin}</div>
            <div>{train.destination} ▶</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded-sm mr-2"></div>
            <span>Window Seat</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-sm mr-2"></div>
            <span>Aisle Seat</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded-sm mr-2"></div>
            <span>Priority Seat</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary border border-primary rounded-sm mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-sm mr-2"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <p className="text-lg font-semibold">Total: {train.price}</p>
          <p className="text-sm text-gray-600">Per passenger</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedSeats.length !== passengers}
            className="px-6"
          >
            Confirm Seats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
