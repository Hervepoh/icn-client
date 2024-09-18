import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/features/store";

interface ProvidersProps {
  children: any;
}

export function ReduxProvider({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
