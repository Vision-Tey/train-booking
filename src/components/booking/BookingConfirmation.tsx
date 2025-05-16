import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Download, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BookingConfirmationProps {
  bookingId: string;
  onViewBookings: () => void;
}

const BookingConfirmation = ({
  bookingId = "UGR" + Math.floor(100000 + Math.random() * 900000),
  onViewBookings,
}: BookingConfirmationProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="mb-6">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your train ticket has been successfully booked and confirmed.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <p className="text-gray-600 mb-2">Booking Reference</p>
        <p className="text-2xl font-bold text-primary mb-4">{bookingId}</p>
        <p className="text-sm text-gray-500">
          A confirmation has been sent to your email and phone number.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Button className="flex items-center justify-center">
          <Download className="mr-2 h-5 w-5" />
          Download Ticket
        </Button>
        <Button
          variant="outline"
          onClick={onViewBookings}
          className="flex items-center justify-center"
        >
          View My Bookings
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="text-gray-600 mb-4">
          Thank you for choosing Uganda Railway for your journey.
        </p>
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center justify-center">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
