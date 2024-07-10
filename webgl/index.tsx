import "../common/reload";
import React from "react";
import { createRoot } from "react-dom/client";
import { Root } from "./components/Root";
import "@atlaskit/css-reset";

const bootstrap = () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) return;

  const root = createRoot(rootElement);

  root.render(<Root />);
};

bootstrap();
