import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Train, Calendar, MapPin, CreditCard } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon = <Train />,
  title = "Feature Title",
  description = "Feature description goes here",
}: FeatureCardProps) => {
  return (
    <Card className="bg-white h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Train className="w-6 h-6" />,
      title: "Easy Booking",
      description:
        "Book your train tickets in just a few clicks with our simple and intuitive booking process.",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Seat Selection",
      description:
        "Choose your preferred seats with our interactive seat map showing available and occupied seats.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Ticket Management",
      description:
        "Easily view, modify or cancel your bookings through your personalized dashboard.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Multiple Payment Options",
      description:
        "Pay securely using mobile money, credit cards, or other convenient payment methods.",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Uganda Railway
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience convenient and comfortable travel across Uganda with our
            modern railway service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-lg">
            Book Your Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
