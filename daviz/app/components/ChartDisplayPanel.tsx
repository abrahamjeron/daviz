"use client";

import { ChartDisplayPanelProps } from "../types/daviz.types";
import SimpleChartView from "./SimpleChartView";

export default function ChartDisplayPanel({
  chartData,
  chartConfig,
  height,
  className = "",
}: ChartDisplayPanelProps) {
  return (
    <div 
      className={`
        flex flex-col h-full 
        bg-white/80 backdrop-blur-xl
        rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        border border-white/20 ring-1 ring-slate-900/5 
        overflow-hidden ${className}
      `}
      style={{ padding: '0' }}
    >
      
      {/* Header */}
      <div className="border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md" style={{ padding: '20px 24px' }}>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 rounded-lg ring-1 ring-indigo-500/10" style={{ padding: '8px' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Visualization</h2>
            <p className="text-[11px] text-slate-500 font-medium">Real-time generated insights</p>
          </div>
        </div>

        {/* Dynamic Badge */}
        {chartConfig?.chartType && (
          <div className="flex items-center gap-2 bg-slate-900 text-white rounded-full shadow-lg shadow-indigo-500/20" style={{ padding: '6px 12px' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {chartConfig.chartType}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-slate-50/50" style={{ padding: '24px' }}>
        
        {/* Technical Grid Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {chartData && chartConfig ? (
          <div className="relative h-full w-full bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 animate-in fade-in zoom-in-95 duration-500 flex flex-col" style={{ padding: '24px' }}>
            <SimpleChartView
              chartType={chartConfig.chartType}
              data={chartData}
              height={height}
            />
          </div>
        ) : (
          /* Empty State */
          <div className="h-full w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-white via-slate-50 to-white opacity-50"></div>
             
             <div className="relative z-10 flex flex-col items-center text-center transition-transform duration-500 group-hover:-translate-y-2" style={{ padding: '32px' }}>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Ready to Visualize</h3>
                <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed">
                  Interact with the AI to generate dynamic charts. Try "Show me sales by region"
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}