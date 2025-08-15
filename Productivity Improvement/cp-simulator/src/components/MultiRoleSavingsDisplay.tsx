import React, { useState } from 'react';
import { MultiRoleSimulationResult, RoleConfigurationResult } from '../types';
import { MultiRoleCalculationService } from '../services/multiRoleCalculationService';
import './MultiRoleSavingsDisplay.css';

interface MultiRoleSavingsDisplayProps {
  result: MultiRoleSimulationResult | null;
}

const MultiRoleSavingsDisplay: React.FC<MultiRoleSavingsDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'individual' | 'comparison'>('summary');
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  if (!result || result.roleResults.length === 0) {
    return (
      <div className="multi-role-savings-placeholder">
        <div className="placeholder-content">
          <span className="placeholder-icon">📊</span>
          <h3>No Complete Configurations</h3>
          <p>Complete at least one role configuration to see multi-role savings analysis.</p>
        </div>
      </div>
    );
  }

  const { totalSavings, aggregatedMetrics } = result;
  const summaryStats = MultiRoleCalculationService.getSummaryStatistics(result);
  const isPositiveSavings = totalSavings.monthlySavings > 0;

  const toggleRoleExpanded = (roleId: string) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const renderSummaryTab = () => (
    <div className="summary-tab">
      {/* Total Savings Summary */}
      <div className="total-savings-card">
        <h3>🎯 Total Multi-Role Savings</h3>
        <div className="total-savings-grid">
          <div className="savings-metric">
            <span className="metric-label">Total Monthly Savings</span>
            <span className={`metric-value large ${isPositiveSavings ? 'positive' : 'negative'}`}>
              {isPositiveSavings ? '+' : ''}
              {MultiRoleCalculationService.formatCurrency(totalSavings.monthlySavings)}
            </span>
          </div>
          <div className="savings-metric">
            <span className="metric-label">Total Yearly Savings</span>
            <span className={`metric-value large ${isPositiveSavings ? 'positive' : 'negative'}`}>
              {isPositiveSavings ? '+' : ''}
              {MultiRoleCalculationService.formatCurrency(totalSavings.yearlySavings)}
            </span>
          </div>
          <div className="savings-metric">
            <span className="metric-label">Total Project Savings ({result.scenario.durationMonths} months)</span>
            <span className={`metric-value extra-large ${isPositiveSavings ? 'positive' : 'negative'}`}>
              {isPositiveSavings ? '+' : ''}
              {MultiRoleCalculationService.formatCurrency(totalSavings.totalProjectSavings)}
            </span>
          </div>
          <div className="savings-metric">
            <span className="metric-label">Overall Savings Percentage</span>
            <span className={`metric-value large ${isPositiveSavings ? 'positive' : 'negative'}`}>
              {isPositiveSavings ? '+' : ''}
              {MultiRoleCalculationService.formatPercentage(totalSavings.savingsPercentage)}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats-grid">
        <div className="stats-card">
          <h4>📈 Configuration Overview</h4>
          <div className="stats-list">
            <div className="stat-item">
              <span className="stat-label">Total Configurations:</span>
              <span className="stat-value">{summaryStats.totalConfigurations}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Complete Configurations:</span>
              <span className="stat-value">{summaryStats.completeConfigurations}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current Total Resources:</span>
              <span className="stat-value">{summaryStats.totalResourcesCurrent}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Target Total Resources:</span>
              <span className="stat-value">{summaryStats.totalResourcesTarget}</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h4>✨ Average Benefits</h4>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <div className="benefit-content">
                <span className="benefit-label">Avg. Productivity Gain</span>
                <span className="benefit-value">
                  {MultiRoleCalculationService.formatPercentage(aggregatedMetrics.averageProductivityGain)}
                </span>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <div className="benefit-content">
                <span className="benefit-label">Avg. Quality Improvement</span>
                <span className="benefit-value">
                  {MultiRoleCalculationService.formatPercentage(aggregatedMetrics.averageQualityImprovement)}
                </span>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🛡️</span>
              <div className="benefit-content">
                <span className="benefit-label">Avg. Risk Reduction</span>
                <span className="benefit-value">
                  {MultiRoleCalculationService.formatPercentage(aggregatedMetrics.averageRiskReduction)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIndividualTab = () => (
    <div className="individual-tab">
      <div className="individual-roles-list">
        {result.roleResults.map((roleResult, index) => {
          const isExpanded = expandedRoles.has(roleResult.roleConfiguration.id);
          const isRolePositive = roleResult.savings.monthlySavings > 0;
          
          return (
            <div key={roleResult.roleConfiguration.id} className="individual-role-card">
              <div className="role-header" onClick={() => toggleRoleExpanded(roleResult.roleConfiguration.id)}>
                <div className="role-title">
                  <button className="expand-toggle">
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  <h4>{roleResult.roleConfiguration.name}</h4>
                  <span className={`savings-badge ${isRolePositive ? 'positive' : 'negative'}`}>
                    {isRolePositive ? '+' : ''}
                    {MultiRoleCalculationService.formatCurrency(roleResult.savings.monthlySavings)}/month
                  </span>
                </div>
              </div>

              {!isExpanded && (
                <div className="role-summary">
                  <div className="summary-item">
                    <span>Current: {roleResult.roleConfiguration.currentConfig.count}× {roleResult.roleConfiguration.currentConfig.role?.name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Target: {roleResult.roleConfiguration.targetConfig.count}× {roleResult.roleConfiguration.targetConfig.role?.name}</span>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className="role-details">
                  <div className="role-savings-grid">
                    <div className="savings-section">
                      <h5>💰 Financial Impact</h5>
                      <div className="savings-metrics">
                        <div className="metric-row">
                          <span>Monthly Savings:</span>
                          <span className={isRolePositive ? 'positive' : 'negative'}>
                            {isRolePositive ? '+' : ''}
                            {MultiRoleCalculationService.formatCurrency(roleResult.savings.monthlySavings)}
                          </span>
                        </div>
                        <div className="metric-row">
                          <span>Yearly Savings:</span>
                          <span className={isRolePositive ? 'positive' : 'negative'}>
                            {isRolePositive ? '+' : ''}
                            {MultiRoleCalculationService.formatCurrency(roleResult.savings.yearlySavings)}
                          </span>
                        </div>
                        <div className="metric-row">
                          <span>Savings %:</span>
                          <span className={isRolePositive ? 'positive' : 'negative'}>
                            {isRolePositive ? '+' : ''}
                            {MultiRoleCalculationService.formatPercentage(roleResult.savings.savingsPercentage)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="config-section">
                      <h5>👥 Configuration</h5>
                      <div className="config-comparison">
                        <div className="config-item">
                          <strong>Current:</strong>
                          <span>{roleResult.roleConfiguration.currentConfig.count}× {roleResult.roleConfiguration.currentConfig.role?.name}</span>
                          <span>📍 {roleResult.roleConfiguration.currentConfig.location?.name}</span>
                        </div>
                        <div className="config-item">
                          <strong>Target:</strong>
                          <span>{roleResult.roleConfiguration.targetConfig.count}× {roleResult.roleConfiguration.targetConfig.role?.name}</span>
                          <span>📍 {roleResult.roleConfiguration.targetConfig.location?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderComparisonTab = () => (
    <div className="comparison-tab">
      <div className="comparison-table">
        <table className="role-comparison-table">
          <thead>
            <tr>
              <th>Role Configuration</th>
              <th>Current Cost/Month</th>
              <th>Target Cost/Month</th>
              <th>Monthly Savings</th>
              <th>Yearly Savings</th>
              <th>Savings %</th>
            </tr>
          </thead>
          <tbody>
            {result.roleResults.map((roleResult) => {
              const isPositive = roleResult.savings.monthlySavings > 0;
              return (
                <tr key={roleResult.roleConfiguration.id}>
                  <td className="role-name">{roleResult.roleConfiguration.name}</td>
                  <td>{MultiRoleCalculationService.formatCurrency(roleResult.savings.currentMonthlyCost)}</td>
                  <td>{MultiRoleCalculationService.formatCurrency(roleResult.savings.targetMonthlyCost)}</td>
                  <td className={isPositive ? 'positive' : 'negative'}>
                    {isPositive ? '+' : ''}{MultiRoleCalculationService.formatCurrency(roleResult.savings.monthlySavings)}
                  </td>
                  <td className={isPositive ? 'positive' : 'negative'}>
                    {isPositive ? '+' : ''}{MultiRoleCalculationService.formatCurrency(roleResult.savings.yearlySavings)}
                  </td>
                  <td className={isPositive ? 'positive' : 'negative'}>
                    {isPositive ? '+' : ''}{MultiRoleCalculationService.formatPercentage(roleResult.savings.savingsPercentage)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td><strong>TOTAL</strong></td>
              <td><strong>{MultiRoleCalculationService.formatCurrency(totalSavings.currentMonthlyCost)}</strong></td>
              <td><strong>{MultiRoleCalculationService.formatCurrency(totalSavings.targetMonthlyCost)}</strong></td>
              <td className={`strong ${isPositiveSavings ? 'positive' : 'negative'}`}>
                <strong>
                  {isPositiveSavings ? '+' : ''}{MultiRoleCalculationService.formatCurrency(totalSavings.monthlySavings)}
                </strong>
              </td>
              <td className={`strong ${isPositiveSavings ? 'positive' : 'negative'}`}>
                <strong>
                  {isPositiveSavings ? '+' : ''}{MultiRoleCalculationService.formatCurrency(totalSavings.yearlySavings)}
                </strong>
              </td>
              <td className={`strong ${isPositiveSavings ? 'positive' : 'negative'}`}>
                <strong>
                  {isPositiveSavings ? '+' : ''}{MultiRoleCalculationService.formatPercentage(totalSavings.savingsPercentage)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  return (
    <div className="multi-role-savings-display">
      <div className="savings-header">
        <h3>📊 Multi-Role Savings Analysis</h3>
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
            onClick={() => setActiveTab('individual')}
          >
            Individual Roles
          </button>
          <button
            className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison Table
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && renderSummaryTab()}
        {activeTab === 'individual' && renderIndividualTab()}
        {activeTab === 'comparison' && renderComparisonTab()}
      </div>
    </div>
  );
};

export default MultiRoleSavingsDisplay; 