'use client';

import {
  FileText,
  IndianRupee,
  Package,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function CompanyOverviewPage() {
  // State for the graph filter
  const [chartFilter, setChartFilter] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const companyName = 'UJJIVAN SMALL FINANCE BANK LIMITED';

  // Data for the 5 top metric cards
  const metrics = [
    {
      label: 'Total Products',
      value: '124',
      change: '+12%',
      isPositive: true,
      icon: Package,
    },
    {
      label: 'Active Vendors',
      value: '32',
      change: '+2',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Invoices',
      value: '450',
      change: '+5%',
      isPositive: true,
      icon: Receipt,
    },
    {
      label: 'E-Way Bills',
      value: '18',
      change: '-2%',
      isPositive: false,
      icon: FileText,
    },
    {
      label: 'Monthly Revenue',
      value: '₹4.2L',
      change: '+15%',
      isPositive: true,
      icon: IndianRupee,
    },
  ];

  // Dummy data for CSS placeholder charts
  const growthData = [40, 60, 45, 70, 65, 85, 80, 100, 90, 110, 105, 120];
  const salesData = [30, 45, 60, 50, 75, 90];
  const revenueData = [50, 65, 80, 70, 95, 120];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. WELCOME BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">
            Welcome to {companyName} Dashboard
          </h2>
          <p className="text-indigo-100 max-w-2xl text-sm">
            Here is your company overview, revenue analytics, and recent
            metrics.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. FIVE METRICS IN ONE LINE */}
      {/* lg:grid-cols-5 forces them into a single line on large screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                <metric.icon className="w-5 h-5" />
              </div>
              <span
                className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                  metric.isPositive
                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {metric.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {metric.change}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {metric.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>

            {/* Subtle decorative background gradient on hover */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* 3. ANALYTICS SECTION HEADER & FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Analytics Overview
        </h3>

        {/* Toggle Filter */}
        <div className="flex bg-gray-100 dark:bg-[#141414] p-1 rounded-lg border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setChartFilter('monthly')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              chartFilter === 'monthly'
                ? 'bg-white dark:bg-[#262626] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setChartFilter('yearly')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              chartFilter === 'yearly'
                ? 'bg-white dark:bg-[#262626] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* 4. GRAPHS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Company Growth (Spans full width) */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Company Growth
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total volume over time
              </p>
            </div>
          </div>
          {/* CSS Line Chart Placeholder */}
          <div className="h-[250px] w-full flex items-end justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
            {growthData.map((val, i) => (
              <div
                key={i}
                className="relative w-full group flex justify-center"
              >
                <div
                  className="w-full max-w-[40px] bg-indigo-100 dark:bg-indigo-900/30 rounded-t-md hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors relative"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-md" />
                </div>
                {/* Tooltip on hover */}
                <span className="absolute -top-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 2: Company Sales */}
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-6">
            Sales Volume
          </h4>
          {/* CSS Bar Chart Placeholder */}
          <div className="h-[200px] w-full flex items-end justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-2">
            {salesData.map((val, i) => (
              <div
                key={i}
                className="w-full bg-blue-500/20 hover:bg-blue-500/40 dark:bg-blue-500/10 dark:hover:bg-blue-500/30 rounded-t-sm transition-colors cursor-pointer border-t-2 border-blue-500"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>

        {/* Graph 3: Company Revenue */}
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-6">
            Revenue Generation
          </h4>
          {/* CSS Bar Chart Placeholder */}
          <div className="h-[200px] w-full flex items-end justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-2">
            {revenueData.map((val, i) => (
              <div
                key={i}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/30 rounded-t-sm transition-colors cursor-pointer border-t-2 border-emerald-500"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
