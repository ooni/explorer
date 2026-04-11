import { useState } from "react";
const Incident = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="absolute inset-x-0 top-40 flex justify-center px-4 py-2 z-50">
      <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg px-4 py-3 max-w-xl w-full shadow-md">
        <span className="text-yellow-500 text-xl leading-tight">⚠️</span>
        <p className="text-lg flex-1">
          Due to an ongoing incident, many explorer services are offline. See{" "}
          <a
            href="https://github.com/ooni/devops/issues/396"
            className="font-medium underline hover:text-yellow-900"
          >
            issue for details
          </a>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="text-yellow-600 hover:text-yellow-900 text-lg leading-none flex-shrink-0"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
export default Incident;
