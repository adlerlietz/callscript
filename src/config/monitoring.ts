import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Request, Response } from 'express';

/**
 * User context interface for monitoring
 */
export interface UserContext {
  id?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Breadcrumb data interface
 */
export interface BreadcrumbData {
  message: string;
  category?: string;
  level?: 'info' | 'warning' | 'error' | 'debug';
  data?: Record<string, unknown>;
}

/**
 * Performance transaction interface
 */
export interface PerformanceTransaction {
  name: string;
  op: string;
  description?: string;
  data?: Record<string, unknown>;
}

/**
 * Health check result interface
 */
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: Record<string, {
    status: 'pass' | 'fail' | 'warn';
    message?: string;
    duration?: number;
  }>;
  timestamp: string;
  uptime: number;
}

/**
 * Monitoring service for error tracking, performance monitoring, and observability
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private isInitialized: boolean = false;
  private startTime: number = Date.now();

  /**
   * Get singleton instance of MonitoringService
   */
  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize Sentry monitoring with configuration
   */
  public initialize(
    dsn?: string,
    environment: string = 'development',
    sampleRate: number = 1.0
  ): void {
    if (this.isInitialized) {
      console.warn('MonitoringService already initialized');
      return;
    }

    if (!dsn) {
      console.warn('No Sentry DSN provided, monitoring will be limited');
      this.isInitialized = true;
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment,
        integrations: [
          new ProfilingIntegration(),
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Express({ app: undefined }),
        ],
        tracesSampleRate: sampleRate,
        profilesSampleRate: sampleRate,
        beforeSend: (event) => {
          if (environment === 'development' && event.level === 'warning') {
            return null;
          }
          return event;
        },
      });

      this.isInitialized = true;
      console.log(`Monitoring initialized for ${environment} environment`);
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
      this.isInitialized = true;
    }
  }

  /**
   * Capture an exception with optional context
   */
  public captureException(
    error: Error,
    context?: Record<string, unknown>
  ): void {
    if (!this.isInitialized) {
      console.error('MonitoringService not initialized:', error);
      return;
    }

    try {
      if (context) {
        Sentry.withScope((scope) => {
          Object.entries(context).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
          Sentry.captureException(error);
        });
      } else {
        Sentry.captureException(error);
      }
    } catch (sentryError) {
      console.error('Failed to capture exception in Sentry:', sentryError);
      console.error('Original error:', error);
    }
  }

  /**
   * Capture a message with specified level and optional extra data
   */
  public captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' | 'debug' = 'info',
    extra?: Record<string, unknown>
  ): void {
    if (!this.isInitialized) {
      console.log(`[${level.toUpperCase()}] ${message}`, extra || '');
      return;
    }

    try {
      if (extra) {
        Sentry.withScope((scope) => {
          Object.entries(extra).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
          Sentry.captureMessage(message, level);
        });
      } else {
        Sentry.captureMessage(message, level);
      }
    } catch (error) {
      console.error('Failed to capture message in Sentry:', error);
      console.log(`[${level.toUpperCase()}] ${message}`, extra || '');
    }
  }

  /**
   * Set user context for all subsequent events
   */
  public setUserContext(user: UserContext): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.email,
        ...user,
      });
    } catch (error) {
      console.error('Failed to set user context:', error);
    }
  }

  /**
   * Add a breadcrumb for debugging context
   */
  public addBreadcrumb(breadcrumb: BreadcrumbData): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category || 'custom',
        level: breadcrumb.level || 'info',
        data: breadcrumb.data,
        timestamp: Date.now() / 1000,
      });
    } catch (error) {
      console.error('Failed to add breadcrumb:', error);
    }
  }

  /**
   * Start a performance transaction
   */
  public startTransaction(
    transaction: PerformanceTransaction
  ): Sentry.Transaction | null {
    if (!this.isInitialized) {
      return null;
    }

    try {
      return Sentry.startTransaction({
        name: transaction.name,
        op: transaction.op,
        description: transaction.description,
        data: transaction.data,
      });
    } catch (error) {
      console.error('Failed to start transaction:', error);
      return null;
    }
  }

  /**
   * Perform comprehensive health check
   */
  public async performHealthCheck(): Promise<HealthCheckResult> {
    const checks: Record<string, {
      status: 'pass' | 'fail' | 'warn';
      message?: string;
      duration?: number;
    }> = {};

    // Check monitoring service
    const monitoringStart = Date.now();
    checks.monitoring = {
      status: this.isInitialized ? 'pass' : 'warn',
      message: this.isInitialized ? 'Monitoring active' : 'Monitoring not initialized',
      duration: Date.now() - monitoringStart,
    };

    // Check memory usage
    const memoryStart = Date.now();
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    checks.memory = {
      status: memoryUsedMB < 512 ? 'pass' : memoryUsedMB < 1024 ? 'warn' : 'fail',
      message: `Memory usage: ${memoryUsedMB.toFixed(2)}MB`,
      duration: Date.now() - memoryStart,
    };

    // Check uptime
    const uptimeStart = Date.now();
    const uptime = Date.now() - this.startTime;
    checks.uptime = {
      status: 'pass',
      message: `Uptime: ${Math.floor(uptime / 1000)}s`,
      duration: Date.now() - uptimeStart,
    };

    const hasFailures = Object.values(checks).some(check => check.status === 'fail');
    const hasWarnings = Object.values(checks).some(check => check.status === 'warn');
    
    const status = hasFailures ? 'unhealthy' : hasWarnings ? 'degraded' : 'healthy';

    return {
      status,
      checks,
      timestamp: new Date().toISOString(),
      uptime: uptime,
    };
  }

  /**
   * Get monitoring service status
   */
  public isMonitoringActive(): boolean {
    return this.isInitialized;
  }

  /**
   * Flush all pending events (useful for graceful shutdown)
   */
  public async flush(timeout: number = 5000): Promise<boolean> {
    if (!this.isInitialized) {
      return true;
    }

    try {
      await Sentry.flush(timeout);
      return true;
    } catch (error) {
      console.error('Failed to flush monitoring events:', error);
      return false;
    }
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();