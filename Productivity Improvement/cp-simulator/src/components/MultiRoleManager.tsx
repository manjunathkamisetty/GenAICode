import React, { useState, useEffect } from 'react';
import { RoleConfiguration, EnhancedResourceConfig } from '../types';
import { EnhancedCalculationService } from '../services/enhancedCalculationService';
import EnhancedResourceConfigSelector from './EnhancedResourceConfigSelector';
import './MultiRoleManager.css';

interface MultiRoleManagerProps {
  roleConfigurations: RoleConfiguration[];
  onConfigurationsChange: (configurations: RoleConfiguration[]) => void;
}

// Enhanced configuration state for each role config
interface EnhancedConfigState {
  [configId: string]: {
    current: Partial<EnhancedResourceConfig>;
    target: Partial<EnhancedResourceConfig>;
  };
}

const MultiRoleManager: React.FC<MultiRoleManagerProps> = ({
  roleConfigurations,
  onConfigurationsChange
}) => {
  const [expandedConfigurations, setExpandedConfigurations] = useState<Set<string>>(new Set());
  
  // Store enhanced configs in state - this is the key fix!
  const [enhancedConfigs, setEnhancedConfigs] = useState<EnhancedConfigState>({});

  // Initialize enhanced configs for new role configurations
  useEffect(() => {
    setEnhancedConfigs(prevConfigs => {
      const newEnhancedConfigs = { ...prevConfigs };
      let hasChanges = false;

      roleConfigurations.forEach(config => {
        if (!newEnhancedConfigs[config.id]) {
          newEnhancedConfigs[config.id] = {
            current: EnhancedCalculationService.createEmptyEnhancedConfig(),
            target: EnhancedCalculationService.createEmptyEnhancedConfig()
          };
          hasChanges = true;
        }
      });

      // Clean up removed configurations
      Object.keys(newEnhancedConfigs).forEach(configId => {
        if (!roleConfigurations.find(config => config.id === configId)) {
          delete newEnhancedConfigs[configId];
          hasChanges = true;
        }
      });

      return hasChanges ? newEnhancedConfigs : prevConfigs;
    });
  }, [roleConfigurations]);

  const addNewConfiguration = () => {
    const newId = `config-${Date.now()}`;
    
    // Create empty legacy configs for compatibility with parent component
    const emptyRole = {
      id: '',
      name: '',
      level: '',
      hourlyRate: 0,
      category: ''
    };
    
    const emptyLocation = {
      id: '',
      name: '',
      country: '',
      valueStream: '',
      art: '',
      scrumTeam: '',
      costMultiplier: 1
    };
    
    const emptyLegacyConfig = {
      role: emptyRole,
      location: emptyLocation,
      count: 1,
      hoursPerMonth: 160
    };
    
    const newConfiguration: RoleConfiguration = {
      id: newId,
      name: `Role Configuration ${roleConfigurations.length + 1}`,
      currentConfig: emptyLegacyConfig,
      targetConfig: { ...emptyLegacyConfig, role: { ...emptyRole }, location: { ...emptyLocation } }
    };

    const updatedConfigurations = [...roleConfigurations, newConfiguration];
    onConfigurationsChange(updatedConfigurations);
    
    // Auto-expand the new configuration
    setExpandedConfigurations(prev => new Set([...Array.from(prev), newId]));
  };

  const removeConfiguration = (configId: string) => {
    const updatedConfigurations = roleConfigurations.filter(config => config.id !== configId);
    onConfigurationsChange(updatedConfigurations);
    
    // Remove from expanded set
    setExpandedConfigurations(prev => {
      const newSet = new Set(Array.from(prev));
      newSet.delete(configId);
      return newSet;
    });
  };

  const toggleExpanded = (configId: string) => {
    setExpandedConfigurations(prev => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(configId)) {
        newSet.delete(configId);
      } else {
        newSet.add(configId);
      }
      return newSet;
    });
  };

  const updateConfigurationName = (configId: string, newName: string) => {
    const updatedConfigurations = roleConfigurations.map(config => 
      config.id === configId ? { ...config, name: newName } : config
    );
    onConfigurationsChange(updatedConfigurations);
  };

  // Update current enhanced config - this works like single role analysis!
  const updateCurrentConfig = (configId: string, enhancedConfig: Partial<EnhancedResourceConfig>) => {
    setEnhancedConfigs(prev => ({
      ...prev,
      [configId]: {
        ...prev[configId],
        current: enhancedConfig
      }
    }));

    // Convert to legacy format for parent component compatibility
    if (EnhancedCalculationService.isEnhancedConfigComplete(enhancedConfig)) {
      const legacyConfig = EnhancedCalculationService.convertToLegacyConfig(enhancedConfig as EnhancedResourceConfig);
      const updatedConfigurations = roleConfigurations.map(config => 
        config.id === configId ? { ...config, currentConfig: legacyConfig } : config
      );
      onConfigurationsChange(updatedConfigurations);
    }
  };

  // Update target enhanced config - this works like single role analysis!
  const updateTargetConfig = (configId: string, enhancedConfig: Partial<EnhancedResourceConfig>) => {
    setEnhancedConfigs(prev => ({
      ...prev,
      [configId]: {
        ...prev[configId],
        target: enhancedConfig
      }
    }));

    // Convert to legacy format for parent component compatibility
    if (EnhancedCalculationService.isEnhancedConfigComplete(enhancedConfig)) {
      const legacyConfig = EnhancedCalculationService.convertToLegacyConfig(enhancedConfig as EnhancedResourceConfig);
      const updatedConfigurations = roleConfigurations.map(config => 
        config.id === configId ? { ...config, targetConfig: legacyConfig } : config
      );
      onConfigurationsChange(updatedConfigurations);
    }
  };

  const copyCurrentToTarget = (configId: string) => {
    const currentConfig = enhancedConfigs[configId]?.current;
    if (currentConfig) {
      updateTargetConfig(configId, currentConfig);
    }
  };

  const duplicateConfiguration = (configId: string) => {
    const originalConfig = roleConfigurations.find(config => config.id === configId);
    if (originalConfig) {
      const newId = `config-${Date.now()}`;
      const duplicatedConfig: RoleConfiguration = {
        ...originalConfig,
        id: newId,
        name: `${originalConfig.name} (Copy)`
      };
      
      const updatedConfigurations = [...roleConfigurations, duplicatedConfig];
      onConfigurationsChange(updatedConfigurations);
      
      // Auto-expand the duplicated configuration
      setExpandedConfigurations(prev => new Set([...Array.from(prev), newId]));
    }
  };

  const isConfigComplete = (config: any): boolean => {
    return !!(config.role?.id && config.location?.id && config.count && config.hoursPerMonth);
  };

  return (
    <div className="multi-role-manager">
      <div className="manager-header">
        <h2>Multiple Role Configurations</h2>
        <button 
          className="add-config-button" 
          onClick={addNewConfiguration}
          title="Add new role configuration"
        >
          + Add Role Configuration
        </button>
      </div>

      {roleConfigurations.length === 0 && (
        <div className="empty-state">
          <div className="empty-content">
            <span className="empty-icon">👥</span>
            <h3>No Role Configurations</h3>
            <p>Add your first role configuration to start calculating savings for multiple roles simultaneously.</p>
            <button className="add-first-config-button" onClick={addNewConfiguration}>
              Add First Configuration
            </button>
          </div>
        </div>
      )}

      <div className="configurations-list">
        {roleConfigurations.map((configuration, index) => {
          const isExpanded = expandedConfigurations.has(configuration.id);
          const isCurrentComplete = isConfigComplete(configuration.currentConfig);
          const isTargetComplete = isConfigComplete(configuration.targetConfig);
          const isBothComplete = isCurrentComplete && isTargetComplete;

          return (
            <div key={configuration.id} className={`configuration-card ${isExpanded ? 'expanded' : ''}`}>
              <div className="configuration-header">
                <div className="config-title-section">
                  <button
                    className="expand-button"
                    onClick={() => toggleExpanded(configuration.id)}
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  <input
                    type="text"
                    value={configuration.name}
                    onChange={(e) => updateConfigurationName(configuration.id, e.target.value)}
                    className="config-name-input"
                    placeholder="Configuration name"
                  />
                </div>

                <div className="config-status">
                  {isBothComplete && (
                    <span className="status-badge complete">✓ Complete</span>
                  )}
                  {isCurrentComplete && !isTargetComplete && (
                    <span className="status-badge partial">⚠ Current Only</span>
                  )}
                  {!isCurrentComplete && isTargetComplete && (
                    <span className="status-badge partial">⚠ Target Only</span>
                  )}
                  {!isCurrentComplete && !isTargetComplete && (
                    <span className="status-badge incomplete">○ Incomplete</span>
                  )}
                </div>

                <div className="config-actions">
                  <button
                    className="copy-button"
                    onClick={() => copyCurrentToTarget(configuration.id)}
                    title="Copy current to target"
                    disabled={!isCurrentComplete}
                  >
                    Copy →
                  </button>
                  <button
                    className="duplicate-button"
                    onClick={() => duplicateConfiguration(configuration.id)}
                    title="Duplicate configuration"
                  >
                    📋
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => removeConfiguration(configuration.id)}
                    title="Remove configuration"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {!isExpanded && isBothComplete && (
                <div className="config-summary-preview">
                  <div className="summary-row">
                    <span className="summary-label">Current:</span>
                    <span className="summary-value">
                      {configuration.currentConfig.count}× {configuration.currentConfig.role?.name} 
                      in {configuration.currentConfig.location?.name}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Target:</span>
                    <span className="summary-value">
                      {configuration.targetConfig.count}× {configuration.targetConfig.role?.name} 
                      in {configuration.targetConfig.location?.name}
                    </span>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className="configuration-details">
                  <div className="configurations-row-multi">
                    {/* Current Configuration */}
                                          <div className="config-section horizontal-section-multi">
                        <EnhancedResourceConfigSelector
                          config={enhancedConfigs[configuration.id]?.current || EnhancedCalculationService.createEmptyEnhancedConfig()}
                          onConfigChange={(config) => updateCurrentConfig(configuration.id, config)}
                          label="📍 Current State"
                        />
                      </div>

                      {/* Horizontal Flow Arrow */}
                      <div className="horizontal-flow-arrow-multi">
                        <div className="horizontal-arrow-container-multi">
                          <span className="horizontal-arrow-multi">→</span>
                          <span className="horizontal-arrow-label-multi">Transform to</span>
                        </div>
                      </div>

                      {/* Target Configuration */}
                      <div className="config-section horizontal-section-multi">
                        <EnhancedResourceConfigSelector
                          config={enhancedConfigs[configuration.id]?.target || EnhancedCalculationService.createEmptyEnhancedConfig()}
                          onConfigChange={(config) => updateTargetConfig(configuration.id, config)}
                          label="🎯 Target State"
                        />
                      </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {roleConfigurations.length > 0 && (
        <div className="manager-footer">
          <div className="total-configurations">
            <span className="count-label">Total Configurations:</span>
            <span className="count-value">{roleConfigurations.length}</span>
          </div>
          <div className="complete-configurations">
            <span className="count-label">Complete:</span>
            <span className="count-value">
              {roleConfigurations.filter(config => 
                isConfigComplete(config.currentConfig) && isConfigComplete(config.targetConfig)
              ).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiRoleManager; 