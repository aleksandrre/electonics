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
    return Math.max(800, elements * 120 + 300);
  };

  const renderSocketCircuit = (room, index) => {
    const sockets = parseInt(room.sockets);
    const svgWidth = calculateSvgWidth(sockets);
    const svgHeight = 200;
    const lastSocketX = 150 + (sockets - 1) * 120;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">
          {room.roomName}ს როზეტების ხაზი
        </h3>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${svgWidth}px` }}>
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
                x2={lastSocketX + 20}
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="90"
                y1="130"
                x2={lastSocketX + 20}
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
        </div>
      </div>
    );
  };

  const renderLightCircuit = (room, index) => {
    const lights = parseInt(room.lights);
    const svgWidth = calculateSvgWidth(lights);
    const svgHeight = 200;
    const lastLightX = 150 + (lights - 1) * 120;

    return (
      <div>
        <h3 className="text-lg font-medium mb-2">
          {room.roomName}ს განათების ხაზი
        </h3>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${svgWidth}px` }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full border rounded"
            >
              {/* ავტომატი */}
              <rect x="50" y="80" width="40" height="60" fill="gray" />
              <text x="45" y="70" className="text-sm">
                ავტომატი
              </text>

              {/* ზედა მთავარი ხაზი */}
              <line
                x1="90"
                y1="90"
                x2={lastLightX + 20}
                y2="90"
                stroke="black"
                strokeWidth="2"
              />

              {/* ნათურები და მათი ვერტიკალური კაბელები */}
              {[...Array(lights)].map((_, i) => {
                const x = 150 + i * 120;
                return (
                  <g key={`light-${i}`}>
                    {/* ნათურა */}
                    <circle
                      cx={x}
                      cy="90"
                      r="20"
                      fill="yellow"
                      stroke="black"
                    />
                    {/* ვერტიკალური კაბელი */}
                    <line
                      x1={x}
                      y1="110"
                      x2={x}
                      y2="130"
                      stroke="black"
                      strokeWidth="2"
                    />
                    {/* ნომერი */}
                    <text x={x} y="150" textAnchor="middle" className="text-sm">
                      სანათი {i + 1}
                    </text>
                    {/* ქვედა კაბელის სეგმენტი მხოლოდ წინა ნათურამდე */}
                    {i < lights - 1 && (
                      <line
                        x1={x}
                        y1="130"
                        x2={x + 120}
                        y2="130"
                        stroke="black"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                );
              })}

              {/* ქვედა კაბელის საწყისი სეგმენტი ავტომატიდან პირველ ნათურამდე */}
              <line
                x1="90"
                y1="130"
                x2="150"
                y2="130"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderRoomCard = (room, index) => (
    <div key={index} className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{room.roomName}</h3>
        <button
          onClick={() => handleDeleteRoom(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X size={20} />
        </button>
      </div>
      {renderSocketCircuit(room, index)}
      {renderLightCircuit(room, index)}
    </div>
  );

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

        <div className="space-y-6">
          {rooms.map((room, index) => renderRoomCard(room, index))}
        </div>
      </div>
    </div>
  );
};

export default CircuitDiagram;
