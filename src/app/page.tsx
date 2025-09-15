"use client";

import React from "react";
import Link from "next/link";
import { Users, Calendar, FileText, DollarSign, Activity, Plus } from "lucide-react";

export default function Home() {
  const dashboardCards = [
    {
      title: "Patient Management",
      description: "Search, view, and update patient records",
      icon: Users,
      href: "/patients",
      color: "bg-blue-500 hover:bg-blue-600",
      stats: "247 Active Patients",
    },
    {
      title: "Appointments",
      description: "Schedule and manage appointments",
      icon: Calendar,
      href: "/appointments",
      color: "bg-green-500 hover:bg-green-600",
      stats: "12 Today",
    },
    {
      title: "Clinical Notes",
      description: "Add and review clinical documentation",
      icon: FileText,
      href: "/clinicaloperation",
      color: "bg-purple-500 hover:bg-purple-600",
      stats: "5 Pending Review",
    },
    {
      title: "Billing",
      description: "Insurance and payment management",
      icon: DollarSign,
      href: "/billing",
      color: "bg-orange-500 hover:bg-orange-600",
      stats: "$12,450 Outstanding",
    },
  ];

  const quickActions = [
    { label: "New Patient", icon: Plus, href: "/patients" },
    { label: "Quick Appointment", icon: Calendar, href: "/appointments" },
    { label: "Add Note", icon: FileText, href: "/clinicaloperation" },
    { label: "Check Vitals", icon: Activity, href: "/vitals/new" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EHR Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Dr. Smith</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Dr. Smith
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your practice today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Link key={index} href={card.href}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">{card.stats}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-700">
                Patient John Doe checked in for 2:00 PM appointment
              </span>
              <span className="text-xs text-gray-500 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-700">
                Lab results received for Sarah Johnson
              </span>
              <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-sm text-gray-700">
                Appointment rescheduled for Mike Wilson
              </span>
              <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
