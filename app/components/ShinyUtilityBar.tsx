import React from 'react';
import type { ShinyHunt, ShinyPortfolio } from '../types/pokemon';

interface ShinyUtilityBarProps {
  currentHunts: ShinyHunt[];
  portfolio: ShinyPortfolio[];
  onStartNewHunt: () => void;
}

export default function ShinyUtilityBar({ 
  currentHunts, 
  portfolio, 
  onStartNewHunt 
}: ShinyUtilityBarProps) {
  const totalHunts = currentHunts.length;
  const totalShinies = portfolio.length;
  const totalEncounters = currentHunts.reduce((sum, hunt) => sum + hunt.totalEncounters, 0);

  return (
    <div className="shiny-utility-bar">
      <div className="utility-bar-content">
        <div className="hunt-stats">
          <div className="stat-item">
            <span className="stat-label">Active Hunts:</span>
            <span className="stat-value">{totalHunts}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Shinies:</span>
            <span className="stat-value">{totalShinies}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Encounters:</span>
            <span className="stat-value">{totalEncounters.toLocaleString()}</span>
          </div>
        </div>
        
        <button 
          className="start-hunt-btn"
          onClick={onStartNewHunt}
        >
          ✨ Start New Hunt
        </button>
      </div>
    </div>
  );
} 