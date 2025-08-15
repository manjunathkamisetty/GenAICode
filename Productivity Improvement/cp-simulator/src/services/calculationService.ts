import { Role, Location, CPScenario, SavingsCalculation, CPSimulationResult, ResourceConfig } from '../types';

export class CalculationService {
  static calculateHourlyCost(role: Role, location: Location, count: number): number {
    return role.hourlyRate * location.costMultiplier * count;
  }

  static calculateMonthlyCost(role: Role, location: Location, count: number, hoursPerMonth: number): number {
    return this.calculateHourlyCost(role, location, count) * hoursPerMonth;
  }

  static calculateYearlyCost(role: Role, location: Location, count: number, hoursPerMonth: number): number {
    return this.calculateMonthlyCost(role, location, count, hoursPerMonth) * 12;
  }

  static calculateSavings(scenario: CPScenario): SavingsCalculation {
    const { currentConfig, targetConfig } = scenario;

    // Hourly calculations
    const currentHourlyCost = this.calculateHourlyCost(
      currentConfig.role,
      currentConfig.location,
      currentConfig.count
    );

    const targetHourlyCost = this.calculateHourlyCost(
      targetConfig.role,
      targetConfig.location,
      targetConfig.count
    );

    const hourlySavings = currentHourlyCost - targetHourlyCost;

    // Monthly calculations
    const currentMonthlyCost = this.calculateMonthlyCost(
      currentConfig.role,
      currentConfig.location,
      currentConfig.count,
      currentConfig.hoursPerMonth
    );

    const targetMonthlyCost = this.calculateMonthlyCost(
      targetConfig.role,
      targetConfig.location,
      targetConfig.count,
      targetConfig.hoursPerMonth
    );

    const monthlySavings = currentMonthlyCost - targetMonthlyCost;

    // Yearly calculations
    const currentYearlyCost = this.calculateYearlyCost(
      currentConfig.role,
      currentConfig.location,
      currentConfig.count,
      currentConfig.hoursPerMonth
    );

    const targetYearlyCost = this.calculateYearlyCost(
      targetConfig.role,
      targetConfig.location,
      targetConfig.count,
      targetConfig.hoursPerMonth
    );

    const yearlySavings = currentYearlyCost - targetYearlyCost;

    // Total project savings
    const totalProjectSavings = monthlySavings * scenario.durationMonths;
    const savingsPercentage = currentMonthlyCost > 0 ? (monthlySavings / currentMonthlyCost) * 100 : 0;

    return {
      currentHourlyCost,
      targetHourlyCost,
      hourlySavings,
      currentMonthlyCost,
      targetMonthlyCost,
      monthlySavings,
      currentYearlyCost,
      targetYearlyCost,
      yearlySavings,
      totalProjectSavings,
      savingsPercentage,
      paybackPeriod: monthlySavings > 0 ? 1 : undefined
    };
  }

  static simulateScenario(scenario: CPScenario): CPSimulationResult {
    const savings = this.calculateSavings(scenario);
    
    // Additional metrics based on location and role changes
    const additionalMetrics = {
      productivityGain: this.calculateProductivityGain(scenario),
      qualityImprovement: this.calculateQualityImprovement(scenario),
      riskReduction: this.calculateRiskReduction(scenario)
    };

    return {
      scenario,
      savings,
      additionalMetrics
    };
  }

  private static calculateProductivityGain(scenario: CPScenario): number {
    const { currentConfig, targetConfig } = scenario;
    // Simplified calculation - could be based on role experience, location timezone, etc.
    const roleProductivityGain = targetConfig.role.level === 'Senior' ? 15 : 
                                targetConfig.role.level === 'Mid' ? 5 : 0;
    const locationProductivityGain = targetConfig.location.country === 'India' ? 10 : 0;
    return Math.min(roleProductivityGain + locationProductivityGain, 25);
  }

  private static calculateQualityImprovement(scenario: CPScenario): number {
    const { targetConfig } = scenario;
    // Quality improvement based on role seniority
    if (targetConfig.role.level === 'Senior' || targetConfig.role.level === 'Principal') {
      return 20;
    } else if (targetConfig.role.level === 'Mid') {
      return 10;
    }
    return 5;
  }

  private static calculateRiskReduction(scenario: CPScenario): number {
    const { targetConfig } = scenario;
    // Risk reduction based on location stability and role experience
    const locationRisk = targetConfig.location.country === 'India' ? 5 : 
                        targetConfig.location.country === 'Poland' ? 10 : 15;
    const roleRisk = targetConfig.role.level === 'Senior' ? 15 : 
                    targetConfig.role.level === 'Mid' ? 10 : 5;
    return Math.min(locationRisk + roleRisk, 30);
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatPercentage(percentage: number): string {
    return `${percentage.toFixed(1)}%`;
  }
} 