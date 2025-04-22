
import React from "react";

const ConfigFooter: React.FC = () => (
  <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
    <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
  </footer>
);

export default ConfigFooter;
