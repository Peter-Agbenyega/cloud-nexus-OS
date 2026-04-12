import { Component, type ErrorInfo, type ReactNode } from 'react'
import type { ModuleDefinition } from '../../routes/modules'

type ModuleErrorBoundaryProps = {
  activeModule: ModuleDefinition
  children: ReactNode
  onRetry: () => void
  resetKey: string
}

type ModuleErrorBoundaryState = {
  hasError: boolean
}

export class ModuleErrorBoundary extends Component<
  ModuleErrorBoundaryProps,
  ModuleErrorBoundaryState
> {
  state: ModuleErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Module render failed for ${this.props.activeModule.id}`, error, errorInfo)
  }

  componentDidUpdate(prevProps: ModuleErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="module-state" role="alert" aria-live="assertive">
          <p className="module-state__eyebrow">Module fault</p>
          <h2 className="module-state__title">{this.props.activeModule.label} view interrupted</h2>
          <p className="module-state__description">
            The active module failed to render. The shell is still stable. Reload the surface to continue.
          </p>
          <button type="button" className="module-state__action" onClick={this.props.onRetry}>
            Reload module surface
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
