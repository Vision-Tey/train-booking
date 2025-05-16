import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Train, Route, Calendar, Users } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import TrainManagement from "./TrainManagement";
import RouteManagement from "./RouteManagement";
import ScheduleManagement from "./ScheduleManagement";
import UserManagement from "./UserManagement";
import { useAuth } from "@/lib/auth";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("trains");
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Shield className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-gray-600">
                Manage trains, routes, schedules, and users
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  Welcome, {profile?.full_name || "Admin"}
                </h2>
                <p className="text-gray-600">
                  You have administrator privileges
                </p>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="trains"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger
                value="trains"
                className={`flex items-center justify-center py-3 ${activeTab === "trains" ? "bg-primary text-white" : "bg-white"} rounded-lg shadow-sm border border-gray-200`}
              >
                <Train className="h-5 w-5 mr-2" />
                Trains
              </TabsTrigger>
              <TabsTrigger
                value="routes"
                className={`flex items-center justify-center py-3 ${activeTab === "routes" ? "bg-primary text-white" : "bg-white"} rounded-lg shadow-sm border border-gray-200`}
              >
                <Route className="h-5 w-5 mr-2" />
                Routes
              </TabsTrigger>
              <TabsTrigger
                value="schedules"
                className={`flex items-center justify-center py-3 ${activeTab === "schedules" ? "bg-primary text-white" : "bg-white"} rounded-lg shadow-sm border border-gray-200`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedules
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className={`flex items-center justify-center py-3 ${activeTab === "users" ? "bg-primary text-white" : "bg-white"} rounded-lg shadow-sm border border-gray-200`}
              >
                <Users className="h-5 w-5 mr-2" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="trains"
              className="bg-white rounded-lg shadow-md p-6"
            >
              <TrainManagement />
            </TabsContent>

            <TabsContent
              value="routes"
              className="bg-white rounded-lg shadow-md p-6"
            >
              <RouteManagement />
            </TabsContent>

            <TabsContent
              value="schedules"
              className="bg-white rounded-lg shadow-md p-6"
            >
              <ScheduleManagement />
            </TabsContent>

            <TabsContent
              value="users"
              className="bg-white rounded-lg shadow-md p-6"
            >
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
