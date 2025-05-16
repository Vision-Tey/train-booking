import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import HeroSection from "./home/HeroSection";
import TicketSearchForm from "./search/TicketSearchForm";
import FeaturesSection from "./home/FeaturesSection";
import Footer from "./layout/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
    passengers: number;
  }) => {
    // Navigate to search page with search parameters
    navigate("/search", {
      state: {
        ...searchData,
        fromHomePage: true,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with Search Form */}
        <section className="relative">
          <HeroSection />
          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
            <TicketSearchForm onSearch={handleSearch} />
          </div>
        </section>

        {/* Spacer for search form overlap */}
        <div className="h-40 md:h-32 bg-white"></div>

        {/* Features Section */}
        <FeaturesSection />

        {/* Popular Routes Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular Routes
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our most traveled railway routes across Uganda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  route: "Kampala - Entebbe",
                  origin: "Kampala Central",
                  destination: "Entebbe",
                  image:
                    "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?w=800&q=80",
                  duration: "1h 30m",
                  price: "UGX 25,000",
                },
                {
                  route: "Kampala - Jinja",
                  origin: "Kampala Central",
                  destination: "Jinja",
                  image:
                    "https://images.unsplash.com/photo-1568290745147-4a0f1778850d?w=800&q=80",
                  duration: "2h 15m",
                  price: "UGX 30,000",
                },
                {
                  route: "Kampala - Mbarara",
                  origin: "Kampala Central",
                  destination: "Mbarara",
                  image:
                    "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&q=80",
                  duration: "3h 45m",
                  price: "UGX 45,000",
                },
              ].map((route, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={route.image}
                      alt={route.route}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{route.route}</h3>
                    <div className="flex justify-between text-gray-600 mb-4">
                      <span>Duration: {route.duration}</span>
                      <span>From {route.price}</span>
                    </div>
                    <button
                      className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        // Set tomorrow as the default date
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        handleSearch({
                          origin: route.origin,
                          destination: route.destination,
                          date: tomorrow,
                          passengers: 1,
                        });
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Passengers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Read about experiences from travelers who have used our services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Nakimuli",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                  testimonial:
                    "The booking process was incredibly simple, and the journey was comfortable. I'll definitely be using Uganda Railway for all my travels!",
                  rating: 5,
                },
                {
                  name: "David Ochen",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                  testimonial:
                    "I was impressed by the punctuality and cleanliness of the trains. The staff were also very helpful throughout the journey.",
                  rating: 4,
                },
                {
                  name: "Grace Atim",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
                  testimonial:
                    "Traveling from Kampala to Jinja was a breeze with Uganda Railway. The scenic views along the way were an added bonus!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"{testimonial.testimonial}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
