import React from "react";
import { Button } from "@/components/ui/button";
import { TrainResult } from "../search/TrainResults";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Users,
  Train,
} from "lucide-react";

interface BookingSummaryProps {
  train: TrainResult;
  selectedSeats: string[];
  passengers: number;
  date?: Date;
  onConfirmBooking: () => void;
  onBack: () => void;
}

const BookingSummary = ({
  train,
  selectedSeats,
  passengers,
  date = new Date(),
  onConfirmBooking,
  onBack,
}: BookingSummaryProps) => {
  const totalPrice = parseInt(train.price.replace(/[^0-9]/g, "")) * passengers;
  const formattedTotalPrice = `UGX ${totalPrice.toLocaleString()}`;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-primary/10 p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Train className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">{train.trainNumber}</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{date.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">
                    {train.departureTime} - {train.arrivalTime} (
                    {train.duration})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-medium">
                    {train.origin} to {train.destination}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-medium">
                    {passengers} passenger{passengers !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Selected Seats</p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md font-medium"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-primary/10 p-4 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Payment Details</h3>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              Ticket Price ({train.price} x {passengers})
            </span>
            <span>{formattedTotalPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Booking Fee</span>
            <span>UGX 5,000</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>UGX {(totalPrice + 5000).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirmBooking}>Proceed to Payment</Button>
      </div>
    </div>
  );
};

export default BookingSummary;
