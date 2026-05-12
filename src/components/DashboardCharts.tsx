"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useTranslation } from './LanguageProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function DashboardCharts({ stats }: { stats: any }) {
  const { t } = useTranslation();

  const incomeData = {
    labels: stats?.incomeByWorkType?.map((i: any) => i._id || 'Other') || [],
    datasets: [
      {
        label: t('stat_earned'),
        data: stats?.incomeByWorkType?.map((i: any) => i.total) || [],
        backgroundColor: ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'],
        borderRadius: 8,
      },
    ],
  };

  const expenseData = {
    labels: stats?.expensesByCategory?.map((e: any) => e._id || 'Other') || [],
    datasets: [
      {
        label: t('stat_expenses'),
        data: stats?.expensesByCategory?.map((e: any) => e.total) || [],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  const writerData = {
    labels: stats?.writerContribution?.map((w: any) => w._id || 'Unknown') || [],
    datasets: [
      {
        data: stats?.writerContribution?.map((w: any) => w.total) || [],
        backgroundColor: [
          '#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#06b6d4',
          '#8b5cf6', '#f97316', '#84cc16', '#64748b', '#ec4899'
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 h-[350px]"
        >
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">{t('chart_income_title')}</h3>
          <Bar data={incomeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 h-[350px]"
        >
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">{t('chart_title')}</h3>
          <Bar data={expenseData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800"
      >
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">{t('chart_writer_title')}</h3>
        <div className="max-w-[400px] mx-auto h-[300px]">
          <Pie 
            data={writerData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { 
                legend: { 
                  position: 'right',
                  labels: {
                    boxWidth: 12,
                    font: { size: 10, weight: 'bold' }
                  }
                } 
              } 
            }} 
          />
        </div>
      </motion.div>
    </div>
  );
}
