import React, { useState, useEffect } from 'react';
import { RoleConfiguration, MultiRoleScenario, MultiRoleSimulationResult, EnhancedResourceConfig, CPSimulationResult } from './types';
import { MultiRoleCalculationService } from './services/multiRoleCalculationService';
import { EnhancedCalculationService } from './services/enhancedCalculationService';
import EnhancedResourceConfigSelector from './components/EnhancedResourceConfigSelector';
import MultiRoleManager from './components/MultiRoleManager';
import SavingsDisplay from './components/SavingsDisplay';
import MultiRoleSavingsDisplay from './components/MultiRoleSavingsDisplay';
import CPCalculator from './components/CPCalculator';
import './App.css';

type SimulationMode = 'single' | 'multi' | 'cp-calculation';

function App() {
  const [mode, setMode] = useState<SimulationMode>('single');
  
  // Enhanced Single Role State
  const [enhancedCurrentConfig, setEnhancedCurrentConfig] = useState<Partial<EnhancedResourceConfig>>(
    EnhancedCalculationService.createEmptyEnhancedConfig()
  );
  const [enhancedTargetConfig, setEnhancedTargetConfig] = useState<Partial<EnhancedResourceConfig>>(
    EnhancedCalculationService.createEmptyEnhancedConfig()
  );
  
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [simulationResult, setSimulationResult] = useState<CPSimulationResult | null>(null);

  // Multi Role State
  const [roleConfigurations, setRoleConfigurations] = useState<RoleConfiguration[]>([]);
  const [multiRoleResult, setMultiRoleResult] = useState<MultiRoleSimulationResult | null>(null);

  // Stored Monthly Savings for CPCalculator
  const [storedMonthlySavings, setStoredMonthlySavings] = useState<number>(0);
  const [savingsSource, setSavingsSource] = useState<'single' | 'multi' | null>(null);

  // CP Calculator persistent data
  const [cpCalculatorData, setCpCalculatorData] = useState({
    valueStream: '',
    art: '',
    team: '',
    adjustedCP: 0,
    currentDollar: 0,
    beforeCPRate: 0,
    futureCPRate: 0,
    percentageImprovement: 0
  });

  // Calculate savings for single role mode
  useEffect(() => {
    if (EnhancedCalculationService.isEnhancedConfigComplete(enhancedCurrentConfig) && 
        EnhancedCalculationService.isEnhancedConfigComplete(enhancedTargetConfig)) {
      
      const savings = EnhancedCalculationService.calculateEnhancedSavings(
        enhancedCurrentConfig,
        enhancedTargetConfig,
        durationMonths
      );

      // Create a result compatible with the existing display
      const scenario = {
        id: 'enhanced-scenario',
        name: 'Enhanced Resource Configuration Analysis',
        currentConfig: EnhancedCalculationService.convertToLegacyConfig(enhancedCurrentConfig),
        targetConfig: EnhancedCalculationService.convertToLegacyConfig(enhancedTargetConfig),
        durationMonths
      };

      const result: CPSimulationResult = {
        scenario,
        savings,
        additionalMetrics: {
          productivityGain: 15,
          qualityImprovement: 10,
          riskReduction: 12
        }
      };

      setSimulationResult(result);
      // Store monthly savings for CPCalculator
      setStoredMonthlySavings(result.savings.monthlySavings);
      setSavingsSource('single');
    } else {
      setSimulationResult(null);
      // Only clear monthly savings if no valid multi-role data exists
      if (roleConfigurations.length === 0 || !multiRoleResult) {
        setStoredMonthlySavings(0);
        setSavingsSource(null);
      }
    }
  }, [enhancedCurrentConfig, enhancedTargetConfig, durationMonths, roleConfigurations.length, multiRoleResult]);

  // Calculate savings for multi role mode
  useEffect(() => {
    if (roleConfigurations.length > 0) {
      const multiScenario: MultiRoleScenario = {
        id: 'multi-role-scenario',
        name: 'Multi-Role Analysis',
        roleConfigurations,
        durationMonths
      };

      const result = MultiRoleCalculationService.simulateMultiRoleScenario(multiScenario);
      setMultiRoleResult(result);
      // Store monthly savings for CPCalculator
      setStoredMonthlySavings(result.totalSavings.monthlySavings);
      setSavingsSource('multi');
    } else {
      setMultiRoleResult(null);
      // Only clear monthly savings if no valid single-role data exists
      if (!simulationResult) {
        setStoredMonthlySavings(0);
        setSavingsSource(null);
      }
    }
  }, [roleConfigurations, durationMonths, simulationResult]);

  const resetAll = () => {
    setEnhancedCurrentConfig(EnhancedCalculationService.createEmptyEnhancedConfig());
    setEnhancedTargetConfig(EnhancedCalculationService.createEmptyEnhancedConfig());
    setRoleConfigurations([]);
    setDurationMonths(12);
    setStoredMonthlySavings(0);
    setSavingsSource(null);
    setSimulationResult(null);
    setMultiRoleResult(null);
    setCpCalculatorData({
      valueStream: '',
      art: '',
      team: '',
      adjustedCP: 0,
      currentDollar: 0,
      beforeCPRate: 0,
      futureCPRate: 0,
      percentageImprovement: 0
    });
  };

  const copyCurrentToTarget = () => {
    setEnhancedTargetConfig({ ...enhancedCurrentConfig });
  };

  const switchMode = (newMode: SimulationMode) => {
    setMode(newMode);
    // Don't clear any data when switching modes - only reset when user clicks reset button
  };

  const isCurrentConfigComplete = () => {
    return EnhancedCalculationService.isEnhancedConfigComplete(enhancedCurrentConfig);
  };

  const isTargetConfigComplete = () => {
    return EnhancedCalculationService.isEnhancedConfigComplete(enhancedTargetConfig);
  };

  // Helper functions to check if tabs have data
  const hasSingleRoleData = () => {
    return isCurrentConfigComplete() || isTargetConfigComplete();
  };

  const hasMultiRoleData = () => {
    return roleConfigurations.length > 0;
  };

  const hasCPCalculationData = () => {
    return cpCalculatorData.valueStream || cpCalculatorData.art || cpCalculatorData.team || 
           cpCalculatorData.adjustedCP > 0 || cpCalculatorData.currentDollar > 0;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>CP Simulator</h1>
          <p className="subtitle">Advanced Cost Position Analysis & Multi-Role Savings Calculator</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Mode Selector */}
          <div className="mode-selector">
            <div className="mode-tabs">
              <button
                className={`mode-tab ${mode === 'single' ? 'active' : ''}`}
                onClick={() => switchMode('single')}
              >
                <span className="mode-icon">🎯</span>
                Single Role Analysis
                {hasSingleRoleData() && <span className="data-indicator">●</span>}
              </button>
              <button
                className={`mode-tab ${mode === 'multi' ? 'active' : ''}`}
                onClick={() => switchMode('multi')}
              >
                <span className="mode-icon">👥</span>
                Multi-Role Analysis
                {hasMultiRoleData() && <span className="data-indicator">●</span>}
              </button>
              <button
                className={`mode-tab ${mode === 'cp-calculation' ? 'active' : ''}`}
                onClick={() => switchMode('cp-calculation')}
              >
                <span className="mode-icon">💰</span>
                $CP Calculation
                {hasCPCalculationData() && <span className="data-indicator">●</span>}
              </button>
            </div>
            <button 
              className="reset-all-button"
              onClick={resetAll}
              title="Reset all data across all tabs"
            >
              🔄 Reset All
            </button>
          </div>

          <div className="simulator-container">
            {mode === 'single' ? (
              <>
                <div className="single-role-layout">
                  <div className="panel-header">
                    <h2>Single Role Configuration</h2>
                    <div className="panel-actions">
                      <button 
                        className="copy-button"
                        onClick={copyCurrentToTarget}
                        title="Copy current configuration to target"
                        disabled={!isCurrentConfigComplete()}
                      >
                        Copy to Target →
                      </button>
                    </div>
                  </div>

                  {/* Current and Target Configurations Side by Side */}
                  <div className="configurations-row">
                    {/* Current Configuration */}
                    <div className="configuration-section horizontal-section">
                      <EnhancedResourceConfigSelector
                        config={enhancedCurrentConfig}
                        onConfigChange={setEnhancedCurrentConfig}
                        label="📍 Current State Configuration"
                      />
                    </div>

                    {/* Horizontal Flow Arrow */}
                    <div className="horizontal-flow-arrow">
                      <div className="horizontal-arrow-container">
                        <span className="horizontal-arrow">→</span>
                        <span className="horizontal-arrow-label">Transform to</span>
                      </div>
                    </div>

                    {/* Target Configuration */}
                    <div className="configuration-section horizontal-section">
                      <EnhancedResourceConfigSelector
                        config={enhancedTargetConfig}
                        onConfigChange={setEnhancedTargetConfig}
                        label="🎯 Target State Configuration"
                      />
                    </div>
                  </div>

                  {/* Project Parameters */}
                  <div className="configuration-section project-params vertical-section">
                    <div className="params-header">
                      <h3>📊 Project Parameters</h3>
                    </div>
                    <div className="parameter-inputs">
                      <div className="input-group duration">
                        <label htmlFor="duration-months">Project Duration</label>
                        <div className="input-with-suffix">
                          <input
                            id="duration-months"
                            type="number"
                            min="1"
                            max="60"
                            value={durationMonths}
                            onChange={(e) => setDurationMonths(parseInt(e.target.value) || 12)}
                            className="parameter-input"
                          />
                          <span className="input-suffix">months</span>
                        </div>
                        <div className="input-helper">
                          <span className="helper-text">
                            Duration for total savings calculation
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Summary for Single Mode */}
                    {isCurrentConfigComplete() && isTargetConfigComplete() && (
                      <div className="quick-summary">
                        <h4>⚡ Quick Impact Summary</h4>
                        <div className="quick-metrics">
                          <div className="quick-metric">
                            <span className="metric-icon">👥</span>
                            <span className="metric-text">
                              {enhancedCurrentConfig.count} → {enhancedTargetConfig.count} resources
                            </span>
                          </div>
                          <div className="quick-metric">
                            <span className="metric-icon">📍</span>
                            <span className="metric-text">
                              {enhancedCurrentConfig.location?.name} → {enhancedTargetConfig.location?.name}
                            </span>
                          </div>
                          <div className="quick-metric">
                            <span className="metric-icon">💼</span>
                            <span className="metric-text">
                              {EnhancedCalculationService.getConfigDisplayName(enhancedCurrentConfig as EnhancedResourceConfig)} → {EnhancedCalculationService.getConfigDisplayName(enhancedTargetConfig as EnhancedResourceConfig)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cost Analysis Section */}
                  <div className="cost-analysis-section">
                    <div className="cost-analysis-header">
                      <h2>💰 Cost Analysis & Savings</h2>
                    </div>
                    <SavingsDisplay result={simulationResult} />
                  </div>
                </div>
              </>
            ) : mode === 'multi' ? (
              <>
                <MultiRoleManager
                  roleConfigurations={roleConfigurations}
                  onConfigurationsChange={setRoleConfigurations}
                />

                {/* Project Parameters for Multi Mode */}
                <div className="configuration-section project-params vertical-section">
                  <div className="params-header">
                    <h3>📊 Project Parameters</h3>
                  </div>
                  <div className="parameter-inputs">
                    <div className="input-group duration">
                      <label htmlFor="duration-months-multi">Project Duration</label>
                      <div className="input-with-suffix">
                        <input
                          id="duration-months-multi"
                          type="number"
                          min="1"
                          max="60"
                          value={durationMonths}
                          onChange={(e) => setDurationMonths(parseInt(e.target.value) || 12)}
                          className="parameter-input"
                        />
                        <span className="input-suffix">months</span>
                      </div>
                      <div className="input-helper">
                        <span className="helper-text">
                          Duration for total savings calculation
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Summary for Multi Mode */}
                  {roleConfigurations.length > 0 && (
                    <div className="quick-summary">
                      <h4>📊 Multi-Role Overview</h4>
                      <div className="quick-metrics">
                        <div className="quick-metric">
                          <span className="metric-icon">📋</span>
                          <span className="metric-text">
                            {roleConfigurations.length} total configurations
                          </span>
                        </div>
                        <div className="quick-metric">
                          <span className="metric-icon">✅</span>
                          <span className="metric-text">
                            {roleConfigurations.filter(config => {
                              // Convert to enhanced configs to check completion
                              const currentEnhanced = EnhancedCalculationService.convertFromLegacyConfig(config.currentConfig);
                              const targetEnhanced = EnhancedCalculationService.convertFromLegacyConfig(config.targetConfig);
                              return currentEnhanced && targetEnhanced && 
                                     EnhancedCalculationService.isEnhancedConfigComplete(currentEnhanced) && 
                                     EnhancedCalculationService.isEnhancedConfigComplete(targetEnhanced);
                            }).length} complete configurations
                          </span>
                        </div>
                        {multiRoleResult && multiRoleResult.roleResults.length > 0 && (
                          <div className="quick-metric">
                            <span className="metric-icon">💰</span>
                            <span className="metric-text">
                              {MultiRoleCalculationService.formatCurrency(multiRoleResult.totalSavings.monthlySavings)}/month total savings
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost Analysis Section for Multi Mode */}
                <div className="cost-analysis-section">
                  <div className="cost-analysis-header">
                    <h2>💰 Multi-Role Cost Analysis & Savings</h2>
                  </div>
                  <MultiRoleSavingsDisplay result={multiRoleResult} />
                </div>
              </>
            ) : (
              <div className="cp-calculation-container">
                <CPCalculator 
                  monthlySavings={storedMonthlySavings} 
                  savingsSource={savingsSource}
                  calculationData={cpCalculatorData}
                  onCalculationDataChange={setCpCalculatorData}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 CP Simulator - Advanced Multi-Role Cost Analysis Tool</p>
          <p className="footer-note">
            Enhanced role-level separation with comprehensive data from your actual Rate and Role matrix
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
