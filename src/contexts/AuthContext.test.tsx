import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component that uses AuthContext
const TestComponent = () => {
  const { token, userId, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="userId">{userId || 'No userId'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <button
        data-testid="login-btn"
        onClick={() => login('test-token', 'test-user-id')}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should provide initial state with no authentication', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('userId')).toHaveTextContent('No userId');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('should handle login correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('userId')).toHaveTextContent('test-user-id');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });

    // Verify localStorage was updated
    expect(localStorageMock.getItem('ttnToken')).toBe('test-token');
    expect(localStorageMock.getItem('ttnUserId')).toBe('test-user-id');
  });

  it('should handle logout correctly', async () => {
    // First login
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });

    // Then logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
      expect(screen.getByTestId('userId')).toHaveTextContent('No userId');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });

    // Verify localStorage was cleared
    expect(localStorageMock.getItem('ttnToken')).toBe(null);
    expect(localStorageMock.getItem('ttnUserId')).toBe(null);
  });

  it('should restore authentication from localStorage on mount', () => {
    // Setup localStorage before rendering
    localStorageMock.setItem('ttnToken', 'stored-token');
    localStorageMock.setItem('ttnUserId', 'stored-user-id');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(screen.getByTestId('userId')).toHaveTextContent('stored-user-id');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console errors for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });
});