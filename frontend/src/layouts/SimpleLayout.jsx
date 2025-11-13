import React from 'react';

/**
 * SimpleLayout: wraps a page without Header
 * Used for Account, Checkout, MyOrders to avoid header issues
 */
export default function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">{children}</div>
  );
}
