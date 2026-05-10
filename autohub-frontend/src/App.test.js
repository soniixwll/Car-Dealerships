import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './components/ErrorBoundary';
import { Skeleton, CarCardSkeleton } from './components/Skeleton';
import Seo from './components/Seo';
import { HelmetProvider } from 'react-helmet-async';

describe('ErrorBoundary', () => {
  // Suppress expected console.error from React + our componentDidCatch.
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = () => {};
  });
  afterAll(() => { console.error = originalError; });

  function Boom() { throw new Error('kaboom'); }

  test('renders fallback when child throws', () => {
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText(/щось пішло не так/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /спробувати знову/i })).toBeInTheDocument();
  });

  test('reset clears error and re-renders children', () => {
    let shouldThrow = true;
    function Toggle() {
      if (shouldThrow) throw new Error('once');
      return <div>recovered</div>;
    }
    render(<ErrorBoundary><Toggle /></ErrorBoundary>);
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /спробувати знову/i }));
    expect(screen.getByText(/recovered/i)).toBeInTheDocument();
  });

  test('renders children when no error', () => {
    render(<ErrorBoundary><div>hello</div></ErrorBoundary>);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});

describe('Skeletons', () => {
  test('Skeleton renders with default props', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  test('CarCardSkeleton renders structure', () => {
    const { container } = render(<CarCardSkeleton />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(2);
  });
});

describe('Seo', () => {
  test('sets document title', async () => {
    render(
      <HelmetProvider>
        <Seo title="Test Page" description="hello" />
      </HelmetProvider>
    );
    // Helmet updates document.title asynchronously.
    await new Promise(r => setTimeout(r, 0));
    expect(document.title).toMatch(/Test Page/);
  });
});
