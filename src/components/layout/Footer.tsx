import React from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface FooterProps {
  companyName?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  quickLinks?: Array<{
    label: string;
    href: string;
  }>;
}

const Footer = ({
  companyName = "Uganda Railway",
  socialLinks = {
    facebook: "https://facebook.com/ugandarailway",
    twitter: "https://twitter.com/ugandarailway",
    instagram: "https://instagram.com/ugandarailway",
  },
  contactInfo = {
    email: "info@ugandarailway.com",
    phone: "+256 700 123 456",
    address: "Railway Headquarters, Kampala, Uganda",
  },
  quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Train Routes", href: "/routes" },
    { label: "My Bookings", href: "/bookings" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
  ],
}: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white w-full py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyName}</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for comfortable and reliable railway travel
              across Uganda.
            </p>
            <div className="flex space-x-4">
              <a
                href={socialLinks.facebook}
                aria-label="Facebook"
                className="hover:text-blue-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={socialLinks.twitter}
                aria-label="Twitter"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href={socialLinks.instagram}
                aria-label="Instagram"
                className="hover:text-blue-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates on new routes, promotions,
              and travel tips.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {companyName}. All rights
            reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="/terms"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/cookies"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
