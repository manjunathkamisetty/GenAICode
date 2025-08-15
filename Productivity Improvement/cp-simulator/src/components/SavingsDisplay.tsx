import React from 'react';
import { CPSimulationResult } from '../types';
import { CalculationService } from '../services/calculationService';
import './SavingsDisplay.css';

interface SavingsDisplayProps {
  result: CPSimulationResult | null;
}

const SavingsDisplay: React.FC<SavingsDisplayProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="savings-display-placeholder">
        <p>Configure both current and target resource settings to see savings calculation</p>
      </div>
    );
  }

  const { savings, additionalMetrics } = result;
  const isPositiveSavings = savings.monthlySavings > 0;

  return (
    <div className="savings-display">
      <div className="savings-header">
        <h3>Cost Analysis & Savings Calculation</h3>
      </div>

      <div className="savings-grid">
        {/* Hourly Cost Analysis */}
        <div className="savings-card hourly">
          <h4>💰 Hourly Cost Analysis</h4>
          <div className="cost-comparison">
            <div className="cost-item current">
              <span className="label">Current Hourly Cost</span>
              <span className="amount">
                {CalculationService.formatCurrency(savings.currentHourlyCost)}
              </span>
            </div>
            <div className="cost-item target">
              <span className="label">Target Hourly Cost</span>
              <span className="amount">
                {CalculationService.formatCurrency(savings.targetHourlyCost)}
              </span>
            </div>
            <div className={`cost-item savings ${isPositiveSavings ? 'positive' : 'negative'}`}>
              <span className="label">Hourly Savings</span>
              <span className={`amount ${isPositiveSavings ? 'positive' : 'negative'}`}>
                {isPositiveSavings ? '+' : ''}
                {CalculationService.formatCurrency(savings.hourlySavings)}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Cost Analysis */}
        <div className="savings-card monthly">
          <h4>📅 Monthly Cost Analysis</h4>
          <div className="cost-comparison">
            <div className="cost-item current">
              <span className="label">Current Monthly Cost</span>
              <span className="amount">
                {CalculationService.formatCurrency(savings.currentMonthlyCost)}
              </span>
            </div>
            <div className="cost-item target">
              <span className="label">Target Monthly Cost</span>
              <span className="amount">
                {CalculationService.formatCurrency(savings.targetMonthlyCost)}
              </span>
            </div>
            <div className={`cost-item savings ${isPositiveSavings ? 'positive' : 'negative'}`}>
              <span className="label">Monthly Savings</span>
              <span className={`amount ${isPositiveSavings ? 'positive' : 'negative'}`}>
                {isPositiveSavings ? '+' : ''}
                {CalculationService.formatCurrency(savings.monthlySavings)}
              </span>
            </div>
          </div>
        </div>

        {/* Yearly Cost Analysis */}
        <div className="savings-card yearly">
          <h4>📈 Yearly Cost Analysis</h4>
          <div className="cost-comparison">
            <div className="cost-item current">
              <span className="label">Current Yearly Cost</span>
              <span className="amount">
                {CalculationService.formatCurrency(savings.currentYearlyCost)}
              </span>
            </div>
            <div className="cost-item target">
              <span className="label">Target Yearly Cost</span>
              <span className="amount">
                {CalculationService.formatCurrency(savings.targetYearlyCost)}
              </span>
            </div>
            <div className={`cost-item savings ${isPositiveSavings ? 'positive' : 'negative'}`}>
              <span className="label">Yearly Savings</span>
              <span className={`amount ${isPositiveSavings ? 'positive' : 'negative'}`}>
                {isPositiveSavings ? '+' : ''}
                {CalculationService.formatCurrency(savings.yearlySavings)}
              </span>
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <div className={`savings-card project-summary ${isPositiveSavings ? 'positive' : 'negative'}`}>
          <h4>🎯 Project Summary ({result.scenario.durationMonths} months)</h4>
          <div className="summary-metrics">
            <div className="metric-row">
              <span className="metric-label">Total Project Savings:</span>
              <span className={`metric-value large ${isPositiveSavings ? 'positive' : 'negative'}`}>
                {isPositiveSavings ? '+' : ''}
                {CalculationService.formatCurrency(savings.totalProjectSavings)}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Savings Percentage:</span>
              <span className={`metric-value ${isPositiveSavings ? 'positive' : 'negative'}`}>
                {isPositiveSavings ? '+' : ''}
                {CalculationService.formatPercentage(savings.savingsPercentage)}
              </span>
            </div>
            {savings.paybackPeriod && (
              <div className="metric-row">
                <span className="metric-label">Payback Period:</span>
                <span className="metric-value">
                  {savings.paybackPeriod} month{savings.paybackPeriod > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="savings-card benefits">
          <h4>✨ Additional Benefits</h4>
          <div className="benefits-grid">
            <div className="benefit-item productivity">
              <span className="benefit-icon">⚡</span>
              <div className="benefit-content">
                <span className="benefit-label">Productivity Gain</span>
                <span className="benefit-value">
                  {CalculationService.formatPercentage(additionalMetrics.productivityGain || 0)}
                </span>
              </div>
            </div>
            <div className="benefit-item quality">
              <span className="benefit-icon">🎯</span>
              <div className="benefit-content">
                <span className="benefit-label">Quality Improvement</span>
                <span className="benefit-value">
                  {CalculationService.formatPercentage(additionalMetrics.qualityImprovement || 0)}
                </span>
              </div>
            </div>
            <div className="benefit-item risk">
              <span className="benefit-icon">🛡️</span>
              <div className="benefit-content">
                <span className="benefit-label">Risk Reduction</span>
                <span className="benefit-value">
                  {CalculationService.formatPercentage(additionalMetrics.riskReduction || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Comparison */}
        <div className="savings-card resource-comparison">
          <h4>👥 Resource Configuration Comparison</h4>
          <div className="resource-grid">
            <div className="resource-column">
              <h5>Current Configuration</h5>
              <div className="resource-details">
                <p><strong>Role:</strong> {result.scenario.currentConfig.role.name}</p>
                <p><strong>Count:</strong> {result.scenario.currentConfig.count} resources</p>
                <p><strong>Location:</strong> {result.scenario.currentConfig.location.name}</p>
                <p><strong>Hours/Month:</strong> {result.scenario.currentConfig.hoursPerMonth}h per resource</p>
                <p><strong>Total Hours:</strong> {result.scenario.currentConfig.count * result.scenario.currentConfig.hoursPerMonth}h/month</p>
              </div>
            </div>
            <div className="resource-column">
              <h5>Target Configuration</h5>
              <div className="resource-details">
                <p><strong>Role:</strong> {result.scenario.targetConfig.role.name}</p>
                <p><strong>Count:</strong> {result.scenario.targetConfig.count} resources</p>
                <p><strong>Location:</strong> {result.scenario.targetConfig.location.name}</p>
                <p><strong>Hours/Month:</strong> {result.scenario.targetConfig.hoursPerMonth}h per resource</p>
                <p><strong>Total Hours:</strong> {result.scenario.targetConfig.count * result.scenario.targetConfig.hoursPerMonth}h/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Summary */}
      <div className="roi-summary">
        <h4>📊 Return on Investment Summary</h4>
        <p className={`roi-text ${isPositiveSavings ? 'positive' : 'negative'}`}>
          {isPositiveSavings ? (
            <>
              This resource configuration change will save approximately{' '}
              <strong>{CalculationService.formatCurrency(savings.totalProjectSavings)}</strong>{' '}
              over {result.scenario.durationMonths} months, representing a{' '}
              <strong>{CalculationService.formatPercentage(savings.savingsPercentage)}</strong> cost reduction.
              <br /><br />
              <strong>Annual Impact:</strong> {CalculationService.formatCurrency(savings.yearlySavings)} yearly savings
              <br />
              <strong>Monthly Impact:</strong> {CalculationService.formatCurrency(savings.monthlySavings)} monthly savings
              <br />
              <strong>Hourly Impact:</strong> {CalculationService.formatCurrency(savings.hourlySavings)} per hour savings
            </>
          ) : (
            <>
              This resource configuration change will increase costs by approximately{' '}
              <strong>{CalculationService.formatCurrency(Math.abs(savings.totalProjectSavings))}</strong>{' '}
              over {result.scenario.durationMonths} months, but may provide strategic benefits through improved quality, 
              productivity, and risk reduction.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default SavingsDisplay; 