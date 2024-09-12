/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/gallery` | `/(app)/settings` | `/..\components\common\ArrowButton` | `/_sitemap` | `/auth/signIn` | `/auth/signUp` | `/gallery` | `/onboarding` | `/settings`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
