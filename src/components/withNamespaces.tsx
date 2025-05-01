import React, { Suspense } from 'react';
import { useNamespaces } from '../utils/i18n/namespaceLoader';

interface WithNamespacesProps {
  namespaces: string | string[];
  fallback?: React.ReactNode;
}

/**
 * Higher-order component that handles loading translation namespaces
 */
export function withNamespaces<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithNamespacesProps
) {
  return function WithNamespacesComponent(props: P) {
    const { ready, t } = useNamespaces(options.namespaces);
    
    if (!ready) {
      return options.fallback || <div>Loading translations...</div>;
    }
    
    return <WrappedComponent {...props} t={t} />;
  };
}

/**
 * Component that handles loading translation namespaces
 */
export function NamespaceLoader({
  namespaces,
  fallback = <div>Loading translations...</div>,
  children
}: WithNamespacesProps & { children: React.ReactNode }) {
  const { ready } = useNamespaces(namespaces);
  
  if (!ready) {
    return fallback;
  }
  
  return <>{children}</>;
}

/**
 * Suspense-based namespace loader component
 */
export function SuspenseNamespaceLoader({
  namespaces,
  fallback = <div>Loading translations...</div>,
  children
}: WithNamespacesProps & { children: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <NamespaceLoader namespaces={namespaces} fallback={fallback}>
        {children}
      </NamespaceLoader>
    </Suspense>
  );
} 