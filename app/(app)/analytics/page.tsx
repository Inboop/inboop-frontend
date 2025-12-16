'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  Instagram,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';

type TimeRange = '7d' | '30d' | '90d' | '12m';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isAdmin = isAdminUser(user?.email);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasData(isAdmin);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const timeRangeLabels: Record<TimeRange, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '12m': 'Last 12 months',
  };

  // Metrics - show mock data for admin, zeros for others
  const metrics = hasData
    ? {
        conversations: 248,
        leads: 156,
        conversionRate: 24,
        revenue: 12450,
      }
    : {
        conversations: 0,
        leads: 0,
        conversionRate: 0,
        revenue: 0,
      };

  return (
    <div className="flex h-full flex-col bg-[#F8F9FA]">
      {/* Page Header */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 pb-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Analytics</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track your business performance and insights</p>
          </div>

          {/* Time Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 ease-out"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="hidden sm:inline">{timeRangeLabels[timeRange]}</span>
              <span className="sm:hidden">{timeRange}</span>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform duration-200', showTimeDropdown && 'rotate-180')} />
            </button>

            {showTimeDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                {(Object.entries(timeRangeLabels) as [TimeRange, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTimeRange(key);
                      setShowTimeDropdown(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm transition-colors',
                      timeRange === key
                        ? 'bg-gray-50 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Total Conversations */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  {hasData && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />
                      12%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.conversations}</p>
                <p className="text-sm text-gray-500 mt-0.5">Conversations</p>
              </div>

              {/* Total Leads */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  {hasData && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />
                      8%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.leads}</p>
                <p className="text-sm text-gray-500 mt-0.5">Total Leads</p>
              </div>

              {/* Conversion Rate */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  {hasData && (
                    <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                      <ArrowDownRight className="w-3 h-3" />
                      2%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.conversionRate}%</p>
                <p className="text-sm text-gray-500 mt-0.5">Conversion Rate</p>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  {hasData && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />
                      15%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-gray-900">${metrics.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-0.5">Total Revenue</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex-1 overflow-auto px-4 md:px-8 pb-6">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="w-40 h-5 mb-4" />
              <Skeleton className="w-full h-64 rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="w-40 h-5 mb-4" />
              <Skeleton className="w-full h-64 rounded-xl" />
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center px-4 max-w-md">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-[#2F5D3E]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No data to display</h2>
              <p className="text-sm text-gray-500 mb-6">
                Connect your Instagram account to start tracking conversations, leads, and revenue metrics.
              </p>
              <a
                href="/settings?tab=integrations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110"
                style={{
                  background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                }}
              >
                <Instagram className="w-4 h-4" />
                Connect Instagram
              </a>
              <p className="text-xs text-gray-400 mt-4">
                Analytics will be generated automatically once you start receiving messages
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Conversations Over Time Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">Conversations Over Time</h3>
                <span className="text-xs text-gray-400">{timeRangeLabels[timeRange]}</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">Chart will appear here</p>
              </div>
            </div>

            {/* Leads by Status Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">Leads by Status</h3>
                <span className="text-xs text-gray-400">{timeRangeLabels[timeRange]}</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">Chart will appear here</p>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">Revenue Trend</h3>
                <span className="text-xs text-gray-400">{timeRangeLabels[timeRange]}</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">Chart will appear here</p>
              </div>
            </div>

            {/* Top Performing Channels */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">Top Channels</h3>
                <span className="text-xs text-gray-400">{timeRangeLabels[timeRange]}</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">Chart will appear here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
