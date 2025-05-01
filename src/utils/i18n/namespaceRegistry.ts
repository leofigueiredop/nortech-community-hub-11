import { SupportedNamespaces } from './types';

/**
 * Priority levels for namespace loading
 */
export enum NamespacePriority {
  Critical = 'critical',   // Load immediately
  High = 'high',          // Load early
  Normal = 'normal',      // Load when needed
  Low = 'low',            // Load after idle
  Lazy = 'lazy'           // Load only when explicitly requested
}

/**
 * Configuration for a namespace
 */
interface NamespaceConfig {
  priority: NamespacePriority;
  dependencies?: SupportedNamespaces[];
  preloadLanguages?: boolean;
}

/**
 * Registry for managing namespace configurations and usage
 */
class NamespaceRegistry {
  private configs = new Map<SupportedNamespaces, NamespaceConfig>();
  private usageCount = new Map<SupportedNamespaces, number>();
  private loadedNamespaces = new Set<string>();

  /**
   * Register a namespace configuration
   */
  register(namespace: SupportedNamespaces, config: NamespaceConfig): void {
    this.configs.set(namespace, {
      priority: config.priority,
      dependencies: config.dependencies || [],
      preloadLanguages: config.preloadLanguages || false
    });
  }

  /**
   * Get the configuration for a namespace
   */
  getConfig(namespace: SupportedNamespaces): NamespaceConfig | undefined {
    return this.configs.get(namespace);
  }

  /**
   * Track namespace usage
   */
  trackUsage(namespace: SupportedNamespaces): void {
    const count = this.usageCount.get(namespace) || 0;
    this.usageCount.set(namespace, count + 1);
  }

  /**
   * Get namespace usage count
   */
  getUsageCount(namespace: SupportedNamespaces): number {
    return this.usageCount.get(namespace) || 0;
  }

  /**
   * Mark a namespace as loaded
   */
  markLoaded(namespace: string, language: string): void {
    this.loadedNamespaces.add(`${namespace}:${language}`);
  }

  /**
   * Check if a namespace is loaded
   */
  isLoaded(namespace: string, language: string): boolean {
    return this.loadedNamespaces.has(`${namespace}:${language}`);
  }

  /**
   * Get all dependencies for a namespace
   */
  getDependencies(namespace: SupportedNamespaces): SupportedNamespaces[] {
    const config = this.configs.get(namespace);
    return config?.dependencies || [];
  }

  /**
   * Get namespaces by priority
   */
  getNamespacesByPriority(priority: NamespacePriority): SupportedNamespaces[] {
    return Array.from(this.configs.entries())
      .filter(([_, config]) => config.priority === priority)
      .map(([ns]) => ns);
  }

  /**
   * Clear loaded state for a namespace
   */
  clearLoaded(namespace: string, language: string): void {
    this.loadedNamespaces.delete(`${namespace}:${language}`);
  }

  /**
   * Reset usage statistics
   */
  resetUsage(): void {
    this.usageCount.clear();
  }
}

export const namespaceRegistry = new NamespaceRegistry();

// Register default configurations
namespaceRegistry.register('common', {
  priority: NamespacePriority.Critical,
  preloadLanguages: true
});

namespaceRegistry.register('forms', {
  priority: NamespacePriority.High,
  dependencies: ['common']
});

namespaceRegistry.register('features', {
  priority: NamespacePriority.Normal,
  dependencies: ['common']
});

namespaceRegistry.register('auth', {
  priority: NamespacePriority.High,
  dependencies: ['common', 'forms']
});

namespaceRegistry.register('navigation', {
  priority: NamespacePriority.Critical,
  dependencies: ['common']
});

namespaceRegistry.register('plurals', {
  priority: NamespacePriority.Lazy
}); 