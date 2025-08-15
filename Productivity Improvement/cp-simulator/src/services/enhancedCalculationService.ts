import { 
  EnhancedResourceConfig, 
  ResourceConfig, 
  SavingsCalculation, 
  Role,
  BaseRole,
  Level,
  Location
} from '../types';
import { 
  BASE_ROLES, 
  LEVELS,
  SAMPLE_LOCATIONS, 
  getLocationBasedRate
} from '../data/sampleData';
import { CalculationService } from './calculationService';

export class EnhancedCalculationService {
  // Convert enhanced config to legacy format for calculation compatibility
  static convertToLegacyConfig(enhancedConfig: EnhancedResourceConfig): ResourceConfig {
    const legacyRole: Role = {
      id: `${enhancedConfig.baseRole.id}-${enhancedConfig.level.id}`,
      name: `${enhancedConfig.level.name} ${enhancedConfig.baseRole.name}`,
      level: enhancedConfig.level.name,
      hourlyRate: enhancedConfig.hourlyRate,
      category: enhancedConfig.baseRole.category
    };

    return {
      role: legacyRole,
      location: enhancedConfig.location,
      count: enhancedConfig.count,
      hoursPerMonth: enhancedConfig.hoursPerMonth
    };
  }

  // Convert legacy config to enhanced format
  static convertFromLegacyConfig = (legacyConfig: ResourceConfig): EnhancedResourceConfig | null => {
    if (!legacyConfig.role || !legacyConfig.location) {
      return null;
    }

    // Parse legacy role ID to get base role and level
    const roleParts = legacyConfig.role.id.split('-');
    if (roleParts.length < 2) {
      return null; // Invalid role format
    }

    const levelId = roleParts[roleParts.length - 1];
    const baseRoleId = roleParts.slice(0, -1).join('-');

    const baseRole = BASE_ROLES.find(r => r.id === baseRoleId);
    const level = LEVELS.find(l => l.id === levelId);

    if (!baseRole || !level) {
      return null; // Role or level not found
    }

    // Use location-based rate with USA as fallback
    let hourlyRate = getLocationBasedRate(baseRole.id, level.id, 'usa'); // fallback to USA rate
    if (legacyConfig.location) {
      const locationBasedRate = getLocationBasedRate(baseRole.id, level.id, legacyConfig.location.id);
      if (locationBasedRate > 0) {
        hourlyRate = locationBasedRate;
      }
    }

    return {
      baseRole,
      level,
      location: legacyConfig.location,
      count: legacyConfig.count,
      hoursPerMonth: legacyConfig.hoursPerMonth,
      hourlyRate
    };
  };

  // Calculate costs for enhanced config
  static calculateHourlyCost(config: EnhancedResourceConfig): number {
    return config.hourlyRate * config.count; // hourlyRate already includes location adjustment
  }

  static calculateMonthlyCost(config: EnhancedResourceConfig): number {
    return this.calculateHourlyCost(config) * config.hoursPerMonth;
  }

  static calculateYearlyCost(config: EnhancedResourceConfig): number {
    return this.calculateMonthlyCost(config) * 12;
  }

  // Calculate savings between two enhanced configs
  static calculateEnhancedSavings(
    currentConfig: EnhancedResourceConfig,
    targetConfig: EnhancedResourceConfig,
    durationMonths: number
  ): SavingsCalculation {
    // Direct calculation without legacy conversion to avoid double cost multiplication
    
    // Hourly calculations
    const currentHourlyCost = this.calculateHourlyCost(currentConfig);
    const targetHourlyCost = this.calculateHourlyCost(targetConfig);
    const hourlySavings = currentHourlyCost - targetHourlyCost;

    // Monthly calculations  
    const currentMonthlyCost = this.calculateMonthlyCost(currentConfig);
    const targetMonthlyCost = this.calculateMonthlyCost(targetConfig);
    const monthlySavings = currentMonthlyCost - targetMonthlyCost;

    // Yearly calculations
    const currentYearlyCost = this.calculateYearlyCost(currentConfig);
    const targetYearlyCost = this.calculateYearlyCost(targetConfig);
    const yearlySavings = currentYearlyCost - targetYearlyCost;

    // Project duration calculations
    const totalCurrentCost = currentMonthlyCost * durationMonths;
    const totalTargetCost = targetMonthlyCost * durationMonths;
    const totalSavings = totalCurrentCost - totalTargetCost;

    // Calculate percentage savings (avoid division by zero)
    const savingsPercentage = currentMonthlyCost > 0 
      ? (monthlySavings / currentMonthlyCost) * 100 
      : 0;

    return {
      // Hourly metrics
      currentHourlyCost,
      targetHourlyCost,
      hourlySavings,

      // Monthly metrics  
      currentMonthlyCost,
      targetMonthlyCost,
      monthlySavings,

      // Yearly metrics
      currentYearlyCost,
      targetYearlyCost,
      yearlySavings,

      // Project metrics
      totalProjectSavings: totalSavings,
      savingsPercentage
    };
  }

  // Check if enhanced config is complete
  static isEnhancedConfigComplete(config: Partial<EnhancedResourceConfig>): config is EnhancedResourceConfig {
    return !!(
      config.baseRole && 
      config.level && 
      config.location && 
      config.count && 
      config.hoursPerMonth && 
      config.hourlyRate && 
      config.hourlyRate > 0
    );
  }

  // Create empty enhanced config
  static createEmptyEnhancedConfig(): Partial<EnhancedResourceConfig> {
    return {
      baseRole: undefined,
      level: undefined,
      location: undefined,
      count: 1,
      hoursPerMonth: 160,
      hourlyRate: 0
    };
  }

  // Calculate effective hourly rate (already location-specific from rate matrix)
  static calculateEffectiveRate(config: EnhancedResourceConfig): number {
    return config.hourlyRate; // hourlyRate is already location-specific
  }

  // Get display name for enhanced config
  static getConfigDisplayName(config: EnhancedResourceConfig): string {
    return `${config.level.name} ${config.baseRole.name}`;
  }

  // Validate role-level combination
  static validateRoleLevelCombination(baseRoleId: string, levelId: string): boolean {
    const rate = getLocationBasedRate(baseRoleId, levelId, 'usa'); // fallback to USA rate
    return rate > 0;
  }

  // Get suggested levels for a role (based on availability and common patterns)
  static getSuggestedLevelsForRole(baseRoleId: string): Level[] {
    const baseRole = BASE_ROLES.find(r => r.id === baseRoleId);
    if (!baseRole) return [];

    // Different role categories have different typical level distributions
    const levelPreferences: Record<string, string[]> = {
      'Software Development': ['junior', 'mid', 'senior', 'lead'],
      'Quality Assurance': ['junior', 'mid', 'senior', 'lead'],
      'Business Analysis': ['junior', 'mid', 'senior', 'lead', 'principal'],
      'Project Management': ['junior', 'mid', 'senior', 'lead', 'principal', 'director'],
      'Architecture': ['mid', 'senior', 'lead', 'principal', 'director'],
      'Data & Analytics': ['junior', 'mid', 'senior', 'lead', 'principal'],
      'DevOps': ['junior', 'mid', 'senior', 'lead', 'principal'],
      'Design': ['junior', 'mid', 'senior', 'lead', 'principal'],
      'Product Management': ['junior', 'mid', 'senior', 'lead', 'principal', 'director'],
      'Agile Coaching': ['mid', 'senior', 'lead'],
      'Documentation': ['junior', 'mid', 'senior', 'lead']
    };

    const preferredLevelIds = levelPreferences[baseRole.category] || ['junior', 'mid', 'senior', 'lead'];
    
    return LEVELS
      .filter(level => preferredLevelIds.includes(level.id))
      .filter(level => this.validateRoleLevelCombination(baseRoleId, level.id))
      .sort((a, b) => a.order - b.order);
  }

  // Format currency (delegate to existing service)
  static formatCurrency(amount: number): string {
    return CalculationService.formatCurrency(amount);
  }

  // Format percentage (delegate to existing service)
  static formatPercentage(percentage: number): string {
    return CalculationService.formatPercentage(percentage);
  }
} 