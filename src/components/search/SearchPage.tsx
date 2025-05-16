import React, { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import HeroSection from "../home/HeroSection";
import TicketSearchForm from "./TicketSearchForm";
import TrainResults, { TrainResult } from "./TrainResults";
import SeatSelection from "../booking/SeatSelection";
import BookingSummary from "../booking/BookingSummary";
import PaymentForm from "../booking/PaymentForm";
import BookingConfirmation from "../booking/BookingConfirmation";
import Footer from "../layout/Footer";
import { useLocation } from "react-router-dom";

type BookingStep =
  | "search"
  | "results"
  | "seats"
  | "summary"
  | "payment"
  | "confirmation";

const SearchPage: React.FC = () => {
  const [bookingStep, setBookingStep] = useState<BookingStep>("search");
  const [searchData, setSearchData] = useState<{
    origin: string;
    destination: string;
    date: Date | undefined;
    passengers: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trainResults, setTrainResults] = useState<TrainResult[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<TrainResult | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const location = useLocation();

  // Check if we came from the home page with search data
  useEffect(() => {
    if (location.state && location.state.fromHomePage) {
      const { origin, destination, date, passengers } = location.state;
      setSearchData({ origin, destination, date, passengers });
      setIsLoading(true);
      setBookingStep("results");

      // Simulate API call delay
      setTimeout(() => {
        const results = generateMockTrains(origin, destination);
        setTrainResults(results);
        setIsLoading(false);
      }, 1500);
    }
  }, [location.state]);

  // Mock train data generator
  const generateMockTrains = (origin: string, destination: string) => {
    const mockTrains: TrainResult[] = [];

    // Generate between 3-6 trains
    const numTrains = Math.floor(Math.random() * 4) + 3;

    for (let i = 1; i <= numTrains; i++) {
      // Generate random departure time between 6am and 8pm
      const departureHour = Math.floor(Math.random() * 14) + 6;
      const departureMinute = Math.random() > 0.5 ? "00" : "30";
      const departureTime = `${departureHour}:${departureMinute}`;

      // Calculate random duration between 1-4 hours
      const durationHours = Math.floor(Math.random() * 3) + 1;
      const durationMinutes = Math.random() > 0.5 ? "00" : "30";

      // Calculate arrival time
      const arrivalHour = (departureHour + durationHours) % 24;
      const arrivalMinute =
        (parseInt(departureMinute) + (durationMinutes === "30" ? 30 : 0)) % 60;
      const arrivalTime = `${arrivalHour}:${arrivalMinute === 0 ? "00" : arrivalMinute}`;

      // Generate random price between 20,000 and 60,000 UGX
      const price = Math.floor(Math.random() * 40000) + 20000;
      const formattedPrice = `UGX ${price.toLocaleString()}`;

      // Generate random number of available seats between 10 and 50
      const seatsAvailable = Math.floor(Math.random() * 40) + 10;

      mockTrains.push({
        id: `TR-${i}`,
        trainNumber: `UGR ${1000 + i}`,
        origin,
        destination,
        departureTime,
        arrivalTime,
        duration: `${durationHours}h ${durationMinutes}m`,
        price: formattedPrice,
        seatsAvailable,
      });
    }

    return mockTrains;
  };

  const handleSearch = (data: {
    origin: string;
    destination: string;
    date: Date | undefined;
    passengers: number;
  }) => {
    setSearchData(data);
    setIsLoading(true);
    setBookingStep("results");

    // Simulate API call delay
    setTimeout(() => {
      const results = generateMockTrains(data.origin, data.destination);
      setTrainResults(results);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectTrain = (train: TrainResult) => {
    setSelectedTrain(train);
    setBookingStep("seats");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmSeats = (seats: string[]) => {
    setSelectedSeats(seats);
    setBookingStep("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBooking = () => {
    setBookingStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentComplete = () => {
    setBookingStep("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewBookings = () => {
    // In a real app, this would navigate to the bookings page
    // For now, we'll just reset to the search page
    setBookingStep("search");
    setSearchData(null);
    setSelectedTrain(null);
    setSelectedSeats([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case "search":
        return (
          <>
            <section className="relative">
              <HeroSection />
              <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
                <TicketSearchForm onSearch={handleSearch} />
              </div>
            </section>
            <div className="h-40 md:h-32 bg-white"></div>
          </>
        );

      case "results":
        return (
          <div className="py-8 px-4">
            <div className="mb-8">
              <TicketSearchForm
                onSearch={handleSearch}
                initialValues={searchData || undefined}
              />
            </div>
            <TrainResults
              results={trainResults}
              onSelectTrain={handleSelectTrain}
              searchData={searchData || undefined}
              isLoading={isLoading}
            />
          </div>
        );

      case "seats":
        return (
          <div className="py-8 px-4">
            {selectedTrain && searchData && (
              <SeatSelection
                train={selectedTrain}
                passengers={searchData.passengers}
                onConfirmSeats={handleConfirmSeats}
                onCancel={() => setBookingStep("results")}
              />
            )}
          </div>
        );

      case "summary":
        return (
          <div className="py-8 px-4">
            {selectedTrain && searchData && (
              <BookingSummary
                train={selectedTrain}
                selectedSeats={selectedSeats}
                passengers={searchData.passengers}
                date={searchData.date}
                onConfirmBooking={handleConfirmBooking}
                onBack={() => setBookingStep("seats")}
              />
            )}
          </div>
        );

      case "payment":
        return (
          <div className="py-8 px-4">
            {selectedTrain && (
              <PaymentForm
                totalAmount={
                  parseInt(selectedTrain.price.replace(/[^0-9]/g, "")) *
                    (searchData?.passengers || 1) +
                  5000
                }
                onPaymentComplete={handlePaymentComplete}
                onBack={() => setBookingStep("summary")}
              />
            )}
          </div>
        );

      case "confirmation":
        return (
          <div className="py-8 px-4">
            <BookingConfirmation onViewBookings={handleViewBookings} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-20">{renderBookingStep()}</main>
      <Footer />
    </div>
  );
};

export default SearchPage;
