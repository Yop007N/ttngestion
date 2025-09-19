import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error when shouldThrow prop is true
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="no-error">No error occurred</div>;
};

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload
  },
  writable: true
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console errors for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockReload.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('no-error')).toBeInTheDocument();
  });

  it('should render error UI when child component throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText(/Se ha producido un error inesperado/)).toBeInTheDocument();
    expect(screen.getByText('Recargar página')).toBeInTheDocument();
    expect(screen.getByText('Intentar de nuevo')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('should call window.location.reload when reload button is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Recargar página');
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should reset error state when retry button is clicked', () => {
    const TestWrapper = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <div>
          <button onClick={() => setShouldThrow(false)}>Fix Error</button>
          <ErrorBoundary>
            <ThrowError shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    };

    render(<TestWrapper />);

    // Initially shows error
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByText('Intentar de nuevo');
    fireEvent.click(retryButton);

    // Fix the underlying error
    fireEvent.click(screen.getByText('Fix Error'));

    // Should show children again
    expect(screen.getByTestId('no-error')).toBeInTheDocument();
  });

  it('should log error to console in development', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error logged:',
      expect.objectContaining({
        message: 'Test error message',
        timestamp: expect.any(String),
        userAgent: expect.any(String),
        url: expect.any(String)
      })
    );

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should show error details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Detalles del error (solo en desarrollo)')).toBeInTheDocument();
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should not show error details in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Detalles del error (solo en desarrollo)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });
});