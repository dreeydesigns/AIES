import React from 'react';
import { BarChart, Download, Filter } from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';

export default function TeacherReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Class Performance Reports</h2>
          <p className="text-neutral-500">Analytics and ML insights for your classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      <EmptyState 
        icon={BarChart}
        title="No Reports Generated Yet"
        description="Not enough student data has been collected to generate meaningful ML insights or performance reports. Check back later once students have completed more modules."
      />
    </div>
  );
}
