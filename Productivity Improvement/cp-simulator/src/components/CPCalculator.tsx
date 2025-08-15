import React, { useState, useEffect } from 'react';
import { VALUE_STREAMS, ARTS, SCRUM_TEAMS } from '../data/sampleData';
import './CPCalculator.css';

interface CPCalculation {
  valueStream: string;
  art: string;
  team: string;
  adjustedCP: number;
  currentDollar: number;
  beforeCPRate: number;
  futureCPRate: number;
  percentageImprovement: number;
}

interface CPCalculatorProps {
  monthlySavings: number;
  savingsSource: 'single' | 'multi' | null;
  calculationData?: CPCalculation;
  onCalculationDataChange?: (data: CPCalculation) => void;
}

const CPCalculator: React.FC<CPCalculatorProps> = ({ 
  monthlySavings = 0, 
  savingsSource = null,
  calculationData,
  onCalculationDataChange
}) => {
  const [calculation, setCalculation] = useState<CPCalculation>(
    calculationData || {
      valueStream: '',
      art: '',
      team: '',
      adjustedCP: 0,
      currentDollar: 0,
      beforeCPRate: 0,
      futureCPRate: 0,
      percentageImprovement: 0
    }
  );

  // Wrapper function to update both local state and parent
  const updateCalculation = (newCalculation: CPCalculation) => {
    setCalculation(newCalculation);
    if (onCalculationDataChange) {
      onCalculationDataChange(newCalculation);
    }
  };

  const handleValueStreamChange = (valueStream: string) => {
    const newCalculation = { ...calculation, valueStream };
    updateCalculation(newCalculation);
  };

  const handleArtChange = (art: string) => {
    const newCalculation = { ...calculation, art };
    updateCalculation(newCalculation);
  };

  const handleTeamChange = (team: string) => {
    const newCalculation = { ...calculation, team };
    updateCalculation(newCalculation);
  };

  const handleAdjustedCPChange = (adjustedCP: number) => {
    const beforeCPRate = adjustedCP > 0 ? calculation.currentDollar / adjustedCP : 0;
    const futureDollar = calculation.currentDollar - monthlySavings;
    const futureCPRate = adjustedCP > 0 ? futureDollar / adjustedCP : 0;
    const percentageImprovement = beforeCPRate > 0 ? ((beforeCPRate - futureCPRate) / beforeCPRate) * 100 : 0;
    const newCalculation = { ...calculation, adjustedCP, beforeCPRate, futureCPRate, percentageImprovement };
    updateCalculation(newCalculation);
  };

  const handleCurrentDollarChange = (currentDollar: number) => {
    const beforeCPRate = calculation.adjustedCP > 0 ? currentDollar / calculation.adjustedCP : 0;
    const futureDollar = currentDollar - monthlySavings;
    const futureCPRate = calculation.adjustedCP > 0 ? futureDollar / calculation.adjustedCP : 0;
    const percentageImprovement = beforeCPRate > 0 ? ((beforeCPRate - futureCPRate) / beforeCPRate) * 100 : 0;
    const newCalculation = { ...calculation, currentDollar, beforeCPRate, futureCPRate, percentageImprovement };
    updateCalculation(newCalculation);
  };

  // Sync with parent's calculationData when it changes
  useEffect(() => {
    if (calculationData) {
      setCalculation(calculationData);
    }
  }, [calculationData]);

  // Recalculate Future $/CP and % Improvement when monthlySavings changes
  useEffect(() => {
    if (calculation.adjustedCP > 0 && calculation.currentDollar > 0) {
      const futureDollar = calculation.currentDollar - monthlySavings;
      const futureCPRate = calculation.adjustedCP > 0 ? futureDollar / calculation.adjustedCP : 0;
      const percentageImprovement = calculation.beforeCPRate > 0 ? ((calculation.beforeCPRate - futureCPRate) / calculation.beforeCPRate) * 100 : 0;
      const newCalculation = { ...calculation, futureCPRate, percentageImprovement };
      updateCalculation(newCalculation);
    }
  }, [monthlySavings, calculation.adjustedCP, calculation.currentDollar, calculation.beforeCPRate]);

  const isCalculationComplete = calculation.valueStream && calculation.art && calculation.team && 
                               calculation.adjustedCP > 0 && calculation.currentDollar > 0;

  return (
    <div className="cp-calculator">
      <div className="calculator-header">
        <h2>$CP Calculation</h2>
        <p className="calculator-description">
          Calculate Before $/CP rate based on organizational context and financial inputs
        </p>
      </div>

      <div className="calculator-content">
        <div className="organizational-section">
          <h3>📋 Organizational Context</h3>
          <div className="form-grid">
            {/* Value Stream Selection */}
            <div className="form-group">
              <label htmlFor="valueStream">Value Stream</label>
              <select
                id="valueStream"
                value={calculation.valueStream}
                onChange={(e) => handleValueStreamChange(e.target.value)}
                className="form-select"
              >
                <option value="">Select Value Stream</option>
                {VALUE_STREAMS.map((vs) => (
                  <option key={vs} value={vs}>
                    {vs}
                  </option>
                ))}
              </select>
            </div>

            {/* ART Selection */}
            <div className="form-group">
              <label htmlFor="art">ART (Agile Release Train)</label>
              <select
                id="art"
                value={calculation.art}
                onChange={(e) => handleArtChange(e.target.value)}
                className="form-select"
              >
                <option value="">Select ART</option>
                {ARTS.map((art) => (
                  <option key={art} value={art}>
                    {art}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Selection */}
            <div className="form-group">
              <label htmlFor="team">Team</label>
              <select
                id="team"
                value={calculation.team}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="form-select"
              >
                <option value="">Select Team</option>
                {SCRUM_TEAMS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="financial-section">
          <h3>💰 Financial Inputs</h3>
          <div className="form-grid">
            {/* Adjusted CP Input */}
            <div className="form-group">
              <label htmlFor="adjustedCP">Adjusted CP</label>
              <input
                type="number"
                id="adjustedCP"
                value={calculation.adjustedCP || ''}
                onChange={(e) => handleAdjustedCPChange(Number(e.target.value))}
                className="form-input"
                placeholder="Enter Adjusted CP"
                min="0"
                step="0.01"
              />
              <span className="input-hint">Enter the adjusted capacity points</span>
            </div>

            {/* Current $ Input */}
            <div className="form-group">
              <label htmlFor="currentDollar">Current $</label>
              <input
                type="number"
                id="currentDollar"
                value={calculation.currentDollar || ''}
                onChange={(e) => handleCurrentDollarChange(Number(e.target.value))}
                className="form-input"
                placeholder="Enter Current $"
                min="0"
                step="0.01"
              />
              <span className="input-hint">Enter the current dollar amount</span>
            </div>

            {/* Calculated Before $/CP */}
            <div className="form-group calculated-field">
              <label htmlFor="beforeCPRate">Before $/CP</label>
              <div className="calculated-value">
                <span className="currency">$</span>
                <span className="value">
                  {calculation.beforeCPRate.toFixed(2)}
                </span>
                <span className="per-unit">per CP</span>
              </div>
              <span className="calculation-formula">
                Current $ ÷ Adjusted CP = ${calculation.currentDollar.toFixed(2)} ÷ {calculation.adjustedCP} = ${calculation.beforeCPRate.toFixed(2)}
              </span>
            </div>

            {/* Calculated Future $/CP */}
            <div className="form-group calculated-field">
              <label htmlFor="futureCPRate">Future $/CP</label>
              <div className="calculated-value future">
                <span className="currency">$</span>
                <span className="value">
                  {calculation.futureCPRate.toFixed(2)}
                </span>
                <span className="per-unit">per CP</span>
              </div>
              <span className="calculation-formula">
                (Current $ - Monthly Savings) ÷ Adjusted CP = (${calculation.currentDollar.toFixed(2)} - ${monthlySavings.toFixed(2)}) ÷ {calculation.adjustedCP} = ${calculation.futureCPRate.toFixed(2)}
              </span>
              <span className="input-hint">
                {monthlySavings > 0 && savingsSource
                  ? `Using monthly savings of $${monthlySavings.toLocaleString()} from ${savingsSource === 'single' ? 'Single-Role' : 'Multi-Role'} analysis`
                  : "Complete Single-Role or Multi-Role analysis to see projected savings"
                }
              </span>
            </div>

            {/* Calculated % Improvement */}
            <div className="form-group calculated-field">
              <label htmlFor="percentageImprovement">% Improvement</label>
              <div className="calculated-value improvement">
                <span className={`value ${calculation.percentageImprovement > 0 ? 'positive' : calculation.percentageImprovement < 0 ? 'negative' : ''}`}>
                  {calculation.percentageImprovement.toFixed(1)}
                </span>
                <span className="per-unit">%</span>
              </div>
              <span className="calculation-formula">
                (Before $/CP - Future $/CP) ÷ Before $/CP × 100 = (${calculation.beforeCPRate.toFixed(2)} - ${calculation.futureCPRate.toFixed(2)}) ÷ ${calculation.beforeCPRate.toFixed(2)} × 100 = {calculation.percentageImprovement.toFixed(1)}%
              </span>
              <span className="input-hint">
                {calculation.percentageImprovement > 0 
                  ? "Positive percentage indicates cost reduction"
                  : calculation.percentageImprovement < 0 
                    ? "Negative percentage indicates cost increase"
                    : "No change in cost per CP"
                }
              </span>
            </div>
          </div>
        </div>

        {isCalculationComplete && (
          <div className="calculation-summary">
            <h3>📊 Calculation Summary</h3>
            <div className="summary-card">
              <div className="summary-header">
                <h4>{calculation.valueStream} - {calculation.art}</h4>
                <p className="team-name">{calculation.team}</p>
              </div>
              <div className="summary-metrics">
                <div className="metric">
                  <span className="metric-label">Adjusted CP:</span>
                  <span className="metric-value">{calculation.adjustedCP}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Current $:</span>
                  <span className="metric-value">${calculation.currentDollar.toLocaleString()}</span>
                </div>
                <div className="metric primary">
                  <span className="metric-label">Before $/CP:</span>
                  <span className="metric-value">${calculation.beforeCPRate.toFixed(2)}</span>
                </div>
                <div className="metric primary">
                  <span className="metric-label">Future $/CP:</span>
                  <span className="metric-value">${calculation.futureCPRate.toFixed(2)}</span>
                </div>
                <div className="metric primary">
                  <span className="metric-label">% Improvement:</span>
                  <span className="metric-value">
                    {calculation.percentageImprovement.toFixed(1)}%
                    {calculation.percentageImprovement > 0 ? ' 📈' : calculation.percentageImprovement < 0 ? ' 📉' : ' ➡️'}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Monthly Savings Used:</span>
                  <span className="metric-value">
                    ${monthlySavings.toLocaleString()}
                    {savingsSource && ` (${savingsSource === 'single' ? 'Single-Role' : 'Multi-Role'})`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isCalculationComplete && (
          <div className="incomplete-notice">
            <div className="notice-content">
              <span className="notice-icon">⚠️</span>
              <p>Please complete all fields to see the calculation summary</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPCalculator;
