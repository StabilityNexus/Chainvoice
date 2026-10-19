import { Component } from "react";
import { Button } from "@/components/ui/button";

/**
 * Catches a render error in one dashboard section and shows a fallback in its
 * place, so the menu stays usable and the user can move on. Without it a
 * single bad record would blank the whole app on every visit.
 *
 * Give it a `key` that changes with the route, so leaving a broken section
 * clears the error instead of carrying it to the next page.
 */
class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[PageErrorBoundary] Section failed to render:", error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { title, description, reloadLabel } = this.props;
    return (
      <div role="alert" className="mx-auto max-w-xl py-16 text-center">
        <h2 className="mb-3 text-xl font-semibold text-white">{title}</h2>
        <p className="mb-6 text-gray-400">{description}</p>
        <Button onClick={() => window.location.reload()}>{reloadLabel}</Button>
      </div>
    );
  }
}

export default PageErrorBoundary;
