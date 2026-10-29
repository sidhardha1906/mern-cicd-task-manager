import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.fetch if needed in test environment
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}
