import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Users, Train } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface TrainResult {
  id: string;
  trainNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
  seatsAvailable: number;
}

interface TrainResultsProps {
  results: TrainResult[];
  onSelectTrain: (train: TrainResult) => void;
  searchData?: {
    origin: string;
    destination: string;
    date: Date | undefined;
    passengers: number;
  };
  isLoading?: boolean;
}

const TrainResults = ({
  results = [],
  onSelectTrain,
  searchData,
  isLoading = false,
}: TrainResultsProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg">Searching for trains...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <Train className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Trains Found</h3>
          <p className="text-gray-600 mb-6">
            {searchData?.origin && searchData?.destination
              ? `No trains available from ${searchData.origin} to ${searchData.destination} on the selected date.`
              : "Please select origin and destination stations to search for trains."}
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Modify Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary/10 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {results.length} Train{results.length !== 1 ? "s" : ""} Found
        </h2>
        {searchData && (
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            <span className="flex items-center">
              <Train className="h-4 w-4 mr-1" />
              {searchData.origin} to {searchData.destination}
            </span>
            {searchData.date && (
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {searchData.date.toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {searchData.passengers} Passenger
              {searchData.passengers !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {results.map((train) => (
          <div
            key={train.id}
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <Train className="h-5 w-5 text-primary mr-2" />
                  <span className="font-semibold text-lg">
                    {train.trainNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <div className="text-lg font-medium">
                      {train.departureTime}
                    </div>
                    <div className="text-gray-600">{train.origin}</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      {train.arrivalTime}
                    </div>
                    <div className="text-gray-600">{train.destination}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">{train.duration}</span>
                </div>
                <div className="text-xl font-bold text-primary mb-2">
                  {train.price}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {train.seatsAvailable} seats available
                </div>
                <Button
                  onClick={() => onSelectTrain(train)}
                  className="w-full md:w-auto"
                >
                  Select Seats
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainResults;
