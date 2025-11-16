
import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { SaleEntry } from '../types';
import Card from '../components/Card';

declare global {
    interface Window {
        Recharts: any;
    }
}
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts || {};

const SalesBookScreen: React.FC = () => {
  const { saleEntries, setCurrentPage } = useApp();
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const sortedSales = useMemo(() => {
    return [...saleEntries].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [saleEntries]);

  const salesSummary = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todaySale = saleEntries.filter(s => s.dateTime.startsWith(todayStr)).reduce((sum, s) => sum + s.totalAmount, 0);
    const yesterdaySale = saleEntries.filter(s => s.dateTime.startsWith(yesterdayStr)).reduce((sum, s) => sum + s.totalAmount, 0);
    const monthlySale = saleEntries.filter(s => {
      const d = new Date(s.dateTime);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).reduce((sum, s) => sum + s.totalAmount, 0);

    return { todaySale, yesterdaySale, monthlySale };
  }, [saleEntries]);

  const paymentTypeData = useMemo(() => {
    const data = saleEntries.reduce((acc, sale) => {
        acc[sale.paymentType] = (acc[sale.paymentType] || 0) + sale.totalAmount;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [saleEntries]);
  
  const salesChartData = useMemo(() => {
    const data: { [key: string]: number } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (timeFrame === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        data[key] = 0;
      }
      saleEntries.forEach(sale => {
        const saleDate = new Date(sale.dateTime);
        if (saleDate >= new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)) {
          const key = saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          data[key] = (data[key] || 0) + sale.totalAmount;
        }
      });
    } else if (timeFrame === 'weekly') {
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (i * 7));
        const key = `Wk ${weekStart.toLocaleDateString('en-US', { day: '2-digit' })}`;
        data[key] = 0;
      }
      saleEntries.forEach(sale => {
        const saleDate = new Date(sale.dateTime);
        const fourWeeksAgo = new Date(today);
        fourWeeksAgo.setDate(today.getDate() - 27); 
        if (saleDate >= fourWeeksAgo) {
          const weekStart = new Date(saleDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const key = `Wk ${weekStart.toLocaleDateString('en-US', { day: '2-digit' })}`;
          if (key in data) {
            data[key] += sale.totalAmount;
          }
        }
      });
    } else { // monthly
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = d.toLocaleDateString('en-US', { month: 'short' });
        data[key] = 0;
      }
      saleEntries.forEach(sale => {
        const saleDate = new Date(sale.dateTime);
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        if (saleDate >= sixMonthsAgo) {
            const key = saleDate.toLocaleDateString('en-US', { month: 'short' });
            data[key] = (data[key] || 0) + sale.totalAmount;
        }
      });
    }
    return Object.entries(data).map(([name, total]) => ({ name, total }));
  }, [saleEntries, timeFrame]);


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const chartAvailable = BarChart && ResponsiveContainer;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Book</h1>
        <button onClick={() => setCurrentPage('addSale')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Add Sale</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><h2 className="text-sm text-gray-500">Today</h2><p className="text-2xl font-bold">₹{salesSummary.todaySale.toLocaleString('en-IN')}</p></Card>
        <Card><h2 className="text-sm text-gray-500">Yesterday</h2><p className="text-2xl font-bold">₹{salesSummary.yesterdaySale.toLocaleString('en-IN')}</p></Card>
        <Card><h2 className="text-sm text-gray-500">This Month</h2><p className="text-2xl font-bold">₹{salesSummary.monthlySale.toLocaleString('en-IN')}</p></Card>
      </div>

      {chartAvailable && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Sales Trend</h2>
            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
              {(['daily', 'weekly', 'monthly'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                    timeFrame === tf ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value: number) => `₹${value / 1000}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']} />
                <Bar dataKey="total" fill="#3b82f6" name="Total Sales" barSize={20} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">All Sales</h2>
        <div className="space-y-3">
            {sortedSales.length === 0 ? (
                <Card className="text-center text-gray-500">No sales recorded yet.</Card>
            ) : sortedSales.map((sale: SaleEntry) => (
                <Card key={sale.id} className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{sale.item} ({sale.qty})</p>
                        <p className="text-sm text-gray-500">{new Date(sale.dateTime).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg text-green-600">₹{sale.totalAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">Sub: ₹{sale.subtotal.toLocaleString('en-IN')} + GST: ₹{sale.gstAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full inline-block mt-1">{sale.paymentType}</p>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SalesBookScreen;
