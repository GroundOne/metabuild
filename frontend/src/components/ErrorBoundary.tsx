import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
    {
        children: ReactNode;
        scope?: string;
        fallback?: ReactNode;
    },
    {
        hasError: boolean;
    }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: unknown) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: unknown) {
        // You can also log the error to an error reporting service
        console.log(`logErrorToMyService(${error}, ${errorInfo}, ${this.props.scope});`);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback ?? <div>Something went wrong</div>;
        }

        return this.props.children;
    }
}
