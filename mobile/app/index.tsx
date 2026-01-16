import { Redirect } from "expo-router";

export default function Index() {
  // Simply redirect to login
  // The AuthProvider in _layout.tsx will handle auth state
  // and the login/signup screens will redirect to gallery if already authenticated
  return <Redirect href="/login" />;
}
