import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
    {
        children: ReactNode;
        scope?: string;
        errorComponent?: ReactNode;
    },
    {
        hasError: boolean;
    }
> {
    state = { hasError: false };

    static getDerivedStateFromError(error: unknown) {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: unknown) {
        console.log(`logErrorToMyService(${error}, ${errorInfo}, ${this.props.scope});`);
    }

    render() {
        if (this.state.hasError) {
            return this.props.errorComponent ?? <div>Something went wrong</div>;
        }

        return this.props.children;
    }
}
