import { type RouteConfig, index } from "@react-router/dev/routes";

// Routes are declared explicitly (rather than with @react-router/fs-routes,
// which pulls in a vulnerable minimatch). Add new route modules here.
export default [index("routes/_index.tsx")] satisfies RouteConfig;
