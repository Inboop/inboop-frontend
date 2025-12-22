'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  Calendar,
  ChevronDown,
  Instagram,
  ShoppingCart,
  Clock,
  AlertCircle,
  RefreshCw,
  Package,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getAnalyticsOverview,
  AnalyticsOverviewResponse,
  formatCurrency,
  formatCurrencyFull,
  formatPercentage,
  formatDuration,
  getDateNDaysAgo,
  getTodayDate,
} from '@/lib/analyticsApi';

type TimeRange = '7d' | '30d' | 'all';

// Skeleton for metric card
function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <Skeleton className="w-10 h-10 rounded-xl mb-3" />
      <Skeleton className="w-20 h-8 mb-1" />
      <Skeleton className="w-24 h-4" />
    </div>
  );
}

// Metric card component
interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
  helper?: string;
}

function MetricCard({ icon, iconBg, value, label, helper }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px]">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', iconBg)}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  );
}

// Section header component
function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [data, setData] = useState<AnalyticsOverviewResponse | null>(null);

  const timeRangeLabels: Record<TimeRange, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    'all': 'All time',
  };

  // Calculate date range based on selection
  const getDateRange = useCallback(() => {
    const to = getTodayDate();
    let from: string | undefined;

    if (timeRange === '7d') {
      from = getDateNDaysAgo(7);
    } else if (timeRange === '30d') {
      from = getDateNDaysAgo(30);
    } else {
      // All time - use a very old date
      from = '2020-01-01';
    }

    return { from, to };
  }, [timeRange]);

  // Fetch analytics data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { from, to } = getDateRange();
      const response = await getAnalyticsOverview({ from, to });
      setData(response);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [getDateRange]);

  // Fetch on mount and when time range changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check if we have meaningful data
  const hasData = data && (
    data.orders.created > 0 ||
    data.leads.created > 0 ||
    data.inbox.conversationsStarted > 0
  );

  return (
    <div className="flex h-full flex-col bg-[#F8F9FA]">
      {/* Page Header */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 pb-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Analytics</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track your business performance</p>
          </div>

          {/* Time Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 ease-out"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="hidden sm:inline">{timeRangeLabels[timeRange]}</span>
              <span className="sm:hidden">{timeRange === 'all' ? 'All' : timeRange}</span>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform duration-200', showTimeDropdown && 'rotate-180')} />
            </button>

            {showTimeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 md:px-8 py-6">
        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Failed to load analytics</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button
                  onClick={fetchData}
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            {/* Orders Section Skeleton */}
            <div>
              <Skeleton className="w-24 h-5 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
            </div>
            {/* Leads Section Skeleton */}
            <div>
              <Skeleton className="w-24 h-5 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
            </div>
            {/* Inbox Section Skeleton */}
            <div>
              <Skeleton className="w-24 h-5 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !hasData && (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center px-4 max-w-md">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-[#2F5D3E]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No data yet</h2>
              <p className="text-sm text-gray-500 mb-6">
                Connect your Instagram account and start receiving messages to see analytics.
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
            </div>
          </div>
        )}

        {/* Data Display */}
        {!isLoading && !error && data && hasData && (
          <div className="space-y-8">
            {/* Orders Section */}
            <section>
              <SectionHeader
                title="Orders"
                icon={<ShoppingCart className="w-3.5 h-3.5 text-gray-500" />}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  icon={<Package className="w-5 h-5 text-blue-600" />}
                  iconBg="bg-blue-50"
                  value={data.orders.created}
                  label="Total Orders"
                  helper={`${data.orders.delivered} delivered`}
                />
                <MetricCard
                  icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                  iconBg="bg-emerald-50"
                  value={data.revenue.gross > 0 ? formatCurrency(data.revenue.gross, data.revenue.currency) : '₹0'}
                  label="Revenue"
                  helper={data.revenue.refunded > 0 ? `${formatCurrencyFull(data.revenue.refunded, data.revenue.currency)} refunded` : undefined}
                />
                <MetricCard
                  icon={<TrendingUp className="w-5 h-5 text-violet-600" />}
                  iconBg="bg-violet-50"
                  value={data.revenue.averageOrderValue > 0 ? formatCurrencyFull(data.revenue.averageOrderValue, data.revenue.currency) : '₹0'}
                  label="Avg Order Value"
                />
                <MetricCard
                  icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
                  iconBg="bg-amber-50"
                  value={data.orders.cancelled}
                  label="Cancelled"
                  helper={data.orders.cancellationRate > 0 ? `${formatPercentage(data.orders.cancellationRate)} rate` : undefined}
                />
              </div>
            </section>

            {/* Leads Section */}
            <section>
              <SectionHeader
                title="Leads"
                icon={<Users className="w-3.5 h-3.5 text-gray-500" />}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  iconBg="bg-purple-50"
                  value={data.leads.created}
                  label="Leads Created"
                  helper={`${data.leads.open} open`}
                />
                <MetricCard
                  icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                  iconBg="bg-emerald-50"
                  value={data.leads.converted}
                  label="Converted"
                />
                <MetricCard
                  icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                  iconBg="bg-blue-50"
                  value={formatPercentage(data.leads.conversionRate)}
                  label="Conversion Rate"
                  helper={`${data.leads.lost + data.leads.closed} lost/closed`}
                />
                <MetricCard
                  icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
                  iconBg="bg-rose-50"
                  value={data.leads.lost}
                  label="Lost"
                />
              </div>
            </section>

            {/* Inbox Section */}
            <section>
              <SectionHeader
                title="Inbox"
                icon={<Inbox className="w-3.5 h-3.5 text-gray-500" />}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard
                  icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
                  iconBg="bg-blue-50"
                  value={data.inbox.conversationsStarted}
                  label="New Conversations"
                  helper={`${data.inbox.activeConversations} active`}
                />
                <MetricCard
                  icon={<Clock className="w-5 h-5 text-amber-600" />}
                  iconBg="bg-amber-50"
                  value={formatDuration(data.inbox.avgFirstResponseMinutes)}
                  label="Avg First Response"
                />
                <MetricCard
                  icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
                  iconBg="bg-rose-50"
                  value={data.inbox.conversationsWithoutResponse}
                  label="Awaiting Response"
                  helper={data.inbox.totalUnreadMessages > 0 ? `${data.inbox.totalUnreadMessages} unread` : undefined}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}