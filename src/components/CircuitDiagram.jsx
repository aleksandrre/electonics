import React, { useState } from "react";
import { Lamp, Power, Home } from "lucide-react";

const CircuitDiagram = () => {
  const [formData, setFormData] = useState({
    roomName: "",
    sockets: "",
    lights: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const renderSocketCircuit = () => {
    if (!formData.sockets) return null;
    const sockets = parseInt(formData.sockets);
    const svgWidth = 800;
    const svgHeight = 200;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">
          {formData.roomName}ს როზეტების ხაზი
        </h3>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full border rounded"
        >
          {/* ავტომატი */}
          <rect x="50" y="80" width="40" height="60" fill="gray" />
          <text x="45" y="70" className="text-sm">
            ავტომატი
          </text>

          {/* მთავარი ხაზები */}
          <line
            x1="90"
            y1="90"
            x2="750"
            y2="90"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="90"
            y1="130"
            x2="750"
            y2="130"
            stroke="black"
            strokeWidth="2"
          />

          {/* როზეტები */}
          {[...Array(sockets)].map((_, i) => {
            const x = 150 + i * 120;
            return (
              <g key={`socket-${i}`}>
                <rect
                  x={x - 20}
                  y="90"
                  width="40"
                  height="40"
                  fill="white"
                  stroke="black"
                />
                <circle cx={x} cy="105" r="4" fill="black" />
                <circle cx={x} cy="115" r="4" fill="black" />
                <text x={x} y="150" textAnchor="middle" className="text-sm">
                  როზეტი {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderLightCircuit = () => {
    if (!formData.lights) return null;
    const lights = parseInt(formData.lights);
    const svgWidth = 800;
    const svgHeight = 200;

    return (
      <div>
        <h3 className="text-lg font-medium mb-2">
          {formData.roomName}ს განათების ხაზი
        </h3>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full border rounded"
        >
          {/* ავტომატი */}
          <rect x="50" y="80" width="40" height="60" fill="gray" />
          <text x="45" y="70" className="text-sm">
            ავტომატი
          </text>

          {/* მთავარი ხაზები */}
          <line
            x1="90"
            y1="90"
            x2="750"
            y2="90"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="90"
            y1="130"
            x2="750"
            y2="130"
            stroke="black"
            strokeWidth="2"
          />

          {/* ნათურები */}
          {[...Array(lights)].map((_, i) => {
            const x = 150 + i * 120;
            return (
              <g key={`light-${i}`}>
                <circle cx={x} cy="90" r="20" fill="yellow" stroke="black" />
                <line
                  x1={x}
                  y1="110"
                  x2={x}
                  y2="130"
                  stroke="black"
                  strokeWidth="2"
                />
                <text x={x} y="150" textAnchor="middle" className="text-sm">
                  სანათი {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">ელექტრო სქემის დაგეგმარება</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Home
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ოთახის სახელი"
                className="pl-10 p-2 border rounded w-full"
                value={formData.roomName}
                onChange={(e) =>
                  setFormData({ ...formData, roomName: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <Power
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                placeholder="როზეტების რაოდენობა"
                className="pl-10 p-2 border rounded w-full"
                value={formData.sockets}
                onChange={(e) =>
                  setFormData({ ...formData, sockets: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <Lamp
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                placeholder="სანათების რაოდენობა"
                className="pl-10 p-2 border rounded w-full"
                value={formData.lights}
                onChange={(e) =>
                  setFormData({ ...formData, lights: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            სქემის დახატვა
          </button>
        </form>

        <div className="space-y-6">
          {renderSocketCircuit()}
          {renderLightCircuit()}
        </div>
      </div>
    </div>
  );
};

export default CircuitDiagram;
