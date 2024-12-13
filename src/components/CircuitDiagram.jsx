import React, { useState } from "react";
import { Lamp, Power, Home, Plus, X } from "lucide-react";

const CircuitDiagram = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    roomName: "",
    sockets: "",
    lights: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRoom.roomName && currentRoom.sockets && currentRoom.lights) {
      setRooms([...rooms, currentRoom]);
      setCurrentRoom({ roomName: "", sockets: "", lights: "" });
    }
  };

  const handleDeleteRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const calculateSvgWidth = (elements) => {
    return Math.max(1200, elements * 120 + 500);
  };

  const renderMainPanel = () => {
    const panelHeight = Math.max(600, rooms.length * 250 + 100);
    const maxWidth = Math.max(
      ...rooms.map((room) =>
        Math.max(
          calculateSvgWidth(parseInt(room.sockets)),
          calculateSvgWidth(parseInt(room.lights))
        )
      )
    );

    return (
      <div className="mb-10">
        <h3 className="text-lg font-medium mb-2">ელექტრო სქემა</h3>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${maxWidth}px` }}>
            <svg
              viewBox={`0 0 ${maxWidth} ${panelHeight}`}
              className="w-full border rounded"
            >
              {/* კარადის კორპუსი */}
              <rect
                x="50"
                y="20"
                width="200"
                height={panelHeight - 40}
                fill="#d1d5db"
                stroke="black"
              />
              <text
                x="150"
                y="50"
                textAnchor="middle"
                className="text-sm font-bold"
              >
                მთავარი კარადა
              </text>

              {/* ოთახების წრედები */}
              {rooms.map((room, index) => {
                const baseY = 120 + index * 250;
                const sockets = parseInt(room.sockets);
                const lights = parseInt(room.lights);
                const circuitStartX = 350;
                const automatOffset = 70;

                return (
                  <g key={`room-${index}`}>
                    <text
                      x="150"
                      y={baseY - 30}
                      textAnchor="middle"
                      className="text-sm font-bold"
                    >
                      {room.roomName}
                    </text>

                    {/* როზეტების წრედი */}
                    <g>
                      {/* კარადის როზეტების ავტომატი */}
                      <rect
                        x="100"
                        y={baseY}
                        width="60"
                        height="40"
                        fill="gray"
                        stroke="black"
                      />
                      <text
                        x="130"
                        y={baseY + 25}
                        textAnchor="middle"
                        className="text-xs fill-white"
                      >
                        როზეტები
                      </text>

                      {/* კარადიდან პირდაპირ გამომავალი ხაზი */}
                      <line
                        x1="160"
                        y1={baseY + 20}
                        x2={circuitStartX}
                        y2={baseY + 20}
                        stroke="black"
                        strokeWidth="2"
                      />

                      {/* როზეტების ძირითადი ხაზები */}
                      <line
                        x1={circuitStartX}
                        y1={baseY + 20}
                        x2={circuitStartX + (sockets - 1) * 120 + 20}
                        y2={baseY + 20}
                        stroke="black"
                        strokeWidth="2"
                      />
                      <line
                        x1={circuitStartX}
                        y1={baseY + 60}
                        x2={circuitStartX + (sockets - 1) * 120 + 20}
                        y2={baseY + 60}
                        stroke="black"
                        strokeWidth="2"
                      />

                      {/* როზეტები */}
                      {[...Array(sockets)].map((_, i) => {
                        const x = circuitStartX + i * 120;
                        return (
                          <g key={`socket-${i}`}>
                            <rect
                              x={x - 20}
                              y={baseY + 20}
                              width="40"
                              height="40"
                              fill="white"
                              stroke="black"
                            />
                            <circle cx={x} cy={baseY + 35} r="4" fill="black" />
                            <circle cx={x} cy={baseY + 45} r="4" fill="black" />
                            <text
                              x={x}
                              y={baseY + 80}
                              textAnchor="middle"
                              className="text-xs"
                            >
                              როზეტი {i + 1}
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    {/* განათების წრედი */}
                    <g>
                      {/* კარადის განათების ავტომატი */}
                      <rect
                        x="100"
                        y={baseY + automatOffset}
                        width="60"
                        height="40"
                        fill="gray"
                        stroke="black"
                      />
                      <text
                        x="130"
                        y={baseY + automatOffset + 25}
                        textAnchor="middle"
                        className="text-xs fill-white"
                      >
                        განათება
                      </text>

                      {/* კარადიდან პირდაპირ გამომავალი ხაზი */}
                      <line
                        x1="160"
                        y1={baseY + automatOffset + 20}
                        x2={circuitStartX}
                        y2={baseY + 120}
                        stroke="black"
                        strokeWidth="2"
                      />

                      {/* განათების ძირითადი ხაზი */}
                      <line
                        x1={circuitStartX}
                        y1={baseY + 120}
                        x2={circuitStartX + (lights - 1) * 120 + 20}
                        y2={baseY + 120}
                        stroke="black"
                        strokeWidth="2"
                      />

                      {/* ნათურები */}
                      {[...Array(lights)].map((_, i) => {
                        const x = circuitStartX + i * 120;
                        return (
                          <g key={`light-${i}`}>
                            <circle
                              cx={x}
                              cy={baseY + 120}
                              r="20"
                              fill="yellow"
                              stroke="black"
                            />
                            <line
                              x1={x}
                              y1={baseY + 140}
                              x2={x}
                              y2={baseY + 160}
                              stroke="black"
                              strokeWidth="2"
                            />
                            <text
                              x={x}
                              y={baseY + 180}
                              textAnchor="middle"
                              className="text-xs"
                            >
                              სანათი {i + 1}
                            </text>
                            {i < lights - 1 && (
                              <line
                                x1={x}
                                y1={baseY + 160}
                                x2={x + 120}
                                y2={baseY + 160}
                                stroke="black"
                                strokeWidth="2"
                              />
                            )}
                          </g>
                        );
                      })}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">
            ელექტრო სქემის დაგეგმარება
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={currentRoom.roomName}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, roomName: e.target.value })
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
                  value={currentRoom.sockets}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, sockets: e.target.value })
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
                  value={currentRoom.lights}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, lights: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              ოთახის დამატება
            </button>
          </form>
        </div>

        {/* მთავარი სქემა */}
        {rooms.length > 0 && renderMainPanel()}
      </div>
    </div>
  );
};

export default CircuitDiagram;
