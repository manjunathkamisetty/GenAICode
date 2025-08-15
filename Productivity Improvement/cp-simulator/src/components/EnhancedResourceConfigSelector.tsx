import React from 'react';
import { BaseRole, EnhancedResourceConfig } from '../types';
import { BASE_ROLES, LEVELS, SAMPLE_LOCATIONS, getLocationBasedRate, getAvailableLevelsForRole } from '../data/sampleData';
import './EnhancedResourceConfigSelector.css';

interface EnhancedResourceConfigSelectorProps {
  config: Partial<EnhancedResourceConfig>;
  onConfigChange: (config: Partial<EnhancedResourceConfig>) => void;
  label: string;
  disabled?: boolean;
}

const EnhancedResourceConfigSelector: React.FC<EnhancedResourceConfigSelectorProps> = ({
  config,
  onConfigChange,
  label,
  disabled = false
}) => {
  const rolesByCategory = BASE_ROLES.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, BaseRole[]>);

  // Get available levels for selected role
  const availableLevels = config.baseRole 
    ? getAvailableLevelsForRole(config.baseRole.id)
    : LEVELS; // Show all levels when no role is selected

  const handleRoleChange = (roleId: string) => {
    const baseRole = BASE_ROLES.find(r => r.id === roleId);
    if (baseRole) {
      // Reset level when role changes (different roles have different available levels)
      const newConfig = { ...config, baseRole, level: undefined, hourlyRate: 0 };
      onConfigChange(newConfig);
    }
  };

  const handleLevelChange = (levelId: string) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (level && config.baseRole) {
      let hourlyRate = 0;
      // If location is already selected, get location-based rate
      if (config.location) {
        hourlyRate = getLocationBasedRate(config.baseRole.id, level.id, config.location.id);
      } else {
        // Fallback to USA rate if no location selected
        hourlyRate = getLocationBasedRate(config.baseRole.id, level.id, 'usa');
      }
      const newConfig = { ...config, level, hourlyRate };
      onConfigChange(newConfig);
    }
  };

  const handleLocationChange = (locationId: string) => {
    const location = SAMPLE_LOCATIONS.find(l => l.id === locationId);
    if (location) {
      // Reset level when location changes since rates are location-specific
      // User needs to reselect level to see accurate location-based rates
      const newConfig = { ...config, location, level: undefined, hourlyRate: 0 };
      onConfigChange(newConfig);
    }
  };

  const handleCountChange = (count: number) => {
    onConfigChange({ ...config, count });
  };

  const handleHoursChange = (hoursPerMonth: number) => {
    onConfigChange({ ...config, hoursPerMonth });
  };

  return (
    <div className="enhanced-resource-config-selector">
      <div className="config-header">
        <h3>{label}</h3>
      </div>

      <div className="config-grid">
        {/* Role Selection */}
        <div className="config-section">
          <label className="config-label">Role Type</label>
          <select
            className="config-dropdown"
            value={config.baseRole?.id || ''}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select a role...</option>
            {Object.entries(rolesByCategory).map(([category, roles]) => (
              <optgroup key={category} label={category}>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          
          {config.baseRole && (
            <div className="role-info">
              <div className="info-badges">
                <span className="badge role-category">{config.baseRole.category}</span>
              </div>
              {config.baseRole.description && (
                <p className="role-description">{config.baseRole.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Level Selection */}
        <div className="config-section">
          <label className="config-label">Experience Level</label>
          <select
            className="config-dropdown"
            value={config.level?.id || ''}
            onChange={(e) => handleLevelChange(e.target.value)}
            disabled={disabled || !config.baseRole || !config.location}
          >
            <option value="">
              {!config.baseRole ? "Select a role first..." : 
               !config.location ? "Select a location first..." : 
               "Select a level..."}
            </option>
            {availableLevels.map(level => {
              const locationId = config.location?.id || 'usa';
              const rate = config.baseRole ? getLocationBasedRate(config.baseRole.id, level.id, locationId) : 0;
              const locationLabel = config.location ? config.location.country : 'USA';
              return (
                <option key={level.id} value={level.id}>
                  {level.name} - ${rate.toFixed(2)}/hr ({locationLabel})
                </option>
              );
            })}
          </select>
          
          {/* Helper text for level selection */}
          {(!config.baseRole || !config.location) && (
            <div className="level-helper">
              <span className="helper-text">
                {!config.baseRole && !config.location 
                  ? "Please select a role and location to see available experience levels"
                  : !config.baseRole 
                    ? "Please select a role first to see available experience levels"
                    : "Please select a location to see location-specific rates"}
              </span>
            </div>
          )}
          
          {config.level && (
            <div className="level-info">
              <div className="info-badges">
                <span className="badge role-level">{config.level.name}</span>
                {config.hourlyRate && config.hourlyRate > 0 && (
                  <span className="badge role-rate">
                    ${config.hourlyRate.toFixed(2)}/hour
                    {config.location && ` (${config.location.country})`}
                  </span>
                )}
              </div>
             {config.level.description && (
               <p className="level-description">{config.level.description}</p>
             )}
           </div>
          )}
        </div>

        {/* Location Selection */}
        <div className="config-section">
          <label className="config-label">Location</label>
          <select
            className="config-dropdown"
            value={config.location?.id || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select a location...</option>
            {SAMPLE_LOCATIONS.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          
          {config.location && (
            <div className="location-info">
              <div className="info-badges">
                <span className="badge location-country">{config.location.country}</span>
                <span className="badge location-selected">Selected Location</span>
              </div>
            </div>
          )}
        </div>

        {/* Resource Count */}
        <div className="config-section">
          <label className="config-label">Resource Count</label>
          <div className="number-input-group">
            <input
              type="number"
              min="1"
              max="100"
              value={config.count || 1}
              onChange={(e) => handleCountChange(parseInt(e.target.value) || 1)}
              className="config-number-input"
              disabled={disabled}
              placeholder="Number of resources"
            />
            <span className="input-suffix">resources</span>
          </div>
        </div>

        {/* Hours per Month */}
        <div className="config-section">
          <label className="config-label">Hours per Month per Resource</label>
          <div className="number-input-group">
            <input
              type="number"
              min="1"
              max="300"
              value={config.hoursPerMonth || 160}
              onChange={(e) => handleHoursChange(parseInt(e.target.value) || 160)}
              className="config-number-input"
              disabled={disabled}
              placeholder="Hours per month"
            />
            <span className="input-suffix">hours/month</span>
          </div>
          <div className="hours-helper">
            <span className="helper-text">
              Typical: 160h (full-time), 80h (part-time), 40h (quarter-time)
            </span>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {config.baseRole && config.level && config.location && config.count && config.hoursPerMonth && (
        <div className="config-summary">
          <h4>Configuration Summary</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Role:</span>
              <span className="summary-value">{config.level.name} {config.baseRole.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Team Size:</span>
              <span className="summary-value">{config.count} resources</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Location:</span>
              <span className="summary-value">{config.location.name}, {config.location.country}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Hourly Rate:</span>
              <span className="summary-value">${config.hourlyRate ? config.hourlyRate.toFixed(2) : '0'}/hour</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Hours/Month:</span>
              <span className="summary-value">{config.count * config.hoursPerMonth} hours</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedResourceConfigSelector; 