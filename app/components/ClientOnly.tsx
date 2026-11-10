"use client";

import React, { useSyncExternalStore } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};
export default ClientOnly;
