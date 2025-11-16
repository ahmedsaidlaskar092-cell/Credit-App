import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/Card';
import { Sparkles, TrendingUp, TrendingDown, Clock, BarChart2, CheckCircle, PieChart } from 'lucide-react';
import { analyzeBusinessData } from '../services/geminiService';
import GeminiAnalysisModal from '../components/GeminiAnalysisModal';

const ReportsScreen: React.FC = () => {
  const { creditEntries, saleEntries } = useApp();
  const [isAnalysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const financialMetrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthSales = saleEntries.filter(s => {
      const d = new Date(s.dateTime);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const previousMonthSales = saleEntries.filter(s => {
      const d = new Date(s.dateTime);
      return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
    });

    const monthlyTurnover = currentMonthSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const monthlyProfit = currentMonthSales.reduce((sum, s) => sum + s.profit, 0);
    const prevMonthTurnover = previousMonthSales.reduce((sum, s) => sum + s.totalAmount, 0);

    const salesGrowth = prevMonthTurnover > 0 ? ((monthlyTurnover - prevMonthTurnover) / prevMonthTurnover) * 100 : monthlyTurnover > 0 ? 100 : 0;

    const paidCredits = creditEntries.filter(c => c.status === 'paid' && c.datePaid);
    const collectionPeriods = paidCredits.map(c => {
      const givenDate = new Date(c.dateTime).getTime();
      const paidDate = new Date(c.datePaid!).getTime();
      return (paidDate - givenDate) / (1000 * 3600 * 24); // difference in days
    });
    const avgCollectionPeriod = collectionPeriods.length > 0 ? collectionPeriods.reduce((a, b) => a + b, 0) / collectionPeriods.length : 0;

    return { monthlyTurnover, monthlyProfit, salesGrowth, avgCollectionPeriod };
  }, [saleEntries, creditEntries]);

  const handleAnalyze = async () => {
    setModalOpen(true);
    setAnalysisLoading(true);
    setAnalysisResult(null);
    const result = await analyzeBusinessData(saleEntries, creditEntries);
    setAnalysisResult(result);
    setAnalysisLoading(false);
  };
  
  const GrowthIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
        {value.toFixed(1)}% vs last month
      </span>
    );
  };

  const reportCards = [
    { title: 'Monthly Turnover', value: `₹${financialMetrics.monthlyTurnover.toLocaleString('en-IN')}`, icon: BarChart2, color: 'text-blue-600' },
    { title: 'Monthly Profit', value: `₹${financialMetrics.monthlyProfit.toLocaleString('en-IN')}`, icon: PieChart, color: 'text-green-600' },
    { title: 'Sales Growth (MoM)', value: <GrowthIndicator value={financialMetrics.salesGrowth} />, icon: financialMetrics.salesGrowth >= 0 ? TrendingUp : TrendingDown, color: financialMetrics.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600' },
    { title: 'Avg. Collection Period', value: `${financialMetrics.avgCollectionPeriod.toFixed(1)} days`, icon: Clock, color: 'text-orange-600' },
  ];

  return (
    <div className="p-4 space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
      </div>
      
      <button 
        onClick={handleAnalyze} 
        disabled={isAnalysisLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50"
      >
        <Sparkles className="mr-2" />
        {isAnalysisLoading ? 'Analyzing...' : 'Get Gemini Business Insights'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map((card, index) => (
          <Card 
            key={card.title} 
            className="animate-spring-in" 
            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
          >
            <div className="flex items-center">
              <div className={`p-2 bg-gray-100 rounded-full mr-3 ${card.color}`}>
                  <card.icon size={22}/>
              </div>
              <h2 className="text-md text-gray-500">{card.title}</h2>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-800">{card.value}</div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <GeminiAnalysisModal
          isLoading={isAnalysisLoading}
          analysisResult={analysisResult}
          onClose={() => setModalOpen(false)}
          title="Business Performance Analysis"
        />
      )}
    </div>
  );
};

export default ReportsScreen;