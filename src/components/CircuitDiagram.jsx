import React, { useState } from "react";
import { Lamp, Power, Home, Plus, X, Zap } from "lucide-react";
import standardSocketImage from "../assets/socket.jpg";
import lightImage from "../assets/light.jpg";
import automatImage from "../assets/automat.jpg";
import automatOrdinaryImage from "../assets/automatOrdinary.jpg";

const CircuitDiagram = () => {
  const powerOptions = [50, 100, 150, 200, 250, 300];
  const wireThicknessOptions = ["3X1.5", "3X2.5", "3X4", "3X6", "5X6"];

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    roomName: "",
    standardSockets: "",
    powerSockets: "",
    lights: "",
  });

  const [devicePowers, setDevicePowers] = useState({});
  const [smartDevices, setSmartDevices] = useState({});
  const [wireParams, setWireParams] = useState({
    "main-power-wire": {
      thickness: "5X6",
      length: "15",
    },
  });

  const images = {
    standardSocket: standardSocketImage,

    light: lightImage,
    automat: automatImage,
    automatOrdinary: automatOrdinaryImage,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      currentRoom.roomName &&
      (currentRoom.standardSockets || currentRoom.powerSockets) &&
      currentRoom.lights
    ) {
      const roomId = `room-${Date.now()}`;

      const newDevicePowers = {};
      const newSmartDevices = {};
      const newWireParams = {};

      // სტანდარტული როზეტები
      for (let i = 0; i < parseInt(currentRoom.standardSockets || 0); i++) {
        const socketId = `${roomId}-standard-socket-${i}`;
        newDevicePowers[socketId] = 100;
        newSmartDevices[socketId] = false;
      }

      // მავთულის პარამეტრები სტანდარტული როზეტების წრედისთვის
      newWireParams[`${roomId}-standard-wire`] = {
        thickness: "3X2.5",
        length: "15",
      };

      // მძლავრი როზეტები
      for (let i = 0; i < parseInt(currentRoom.powerSockets || 0); i++) {
        const socketId = `${roomId}-power-socket-${i}`;
        newDevicePowers[socketId] = 100;
        newSmartDevices[socketId] = false;
        // მავთულის პარამეტრები თითოეული მძლავრი როზეტის წრედისთვის
        newWireParams[`${roomId}-power-wire-${i}`] = {
          thickness: "3X2.5",
          length: "15",
        };
      }

      // სანათები
      for (let i = 0; i < parseInt(currentRoom.lights); i++) {
        const lightId = `${roomId}-light-${i}`;
        newDevicePowers[lightId] = 100;
        newSmartDevices[lightId] = false;
      }

      // მავთულის პარამეტრები განათების წრედისთვის
      newWireParams[`${roomId}-light-wire`] = {
        thickness: "3X1.5",
        length: "15",
      };

      setDevicePowers((prev) => ({ ...prev, ...newDevicePowers }));
      setSmartDevices((prev) => ({ ...prev, ...newSmartDevices }));
      setWireParams((prev) => ({ ...prev, ...newWireParams }));

      setRooms([...rooms, { ...currentRoom, id: roomId }]);
      setCurrentRoom({
        roomName: "",
        standardSockets: "",
        powerSockets: "",
        lights: "",
      });
    }
  };

  const updateDevicePower = (deviceId, power) => {
    setDevicePowers((prev) => ({
      ...prev,
      [deviceId]: power,
    }));
  };

  const toggleSmartDevice = (deviceId) => {
    setSmartDevices((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  const updateWireParams = (wireId, field, value) => {
    setWireParams((prev) => ({
      ...prev,
      [wireId]: {
        ...prev[wireId],
        [field]: value,
      },
    }));
  };

  const renderWireParams = (wireId, x, y) => (
    <foreignObject x={x} y={y} width="200" height="60">
      <div xmlns="http://www.w3.org/1999/xhtml" className="flex gap-2">
        <select
          value={wireParams[wireId]?.thickness || "3X1.5"}
          onChange={(e) =>
            updateWireParams(wireId, "thickness", e.target.value)
          }
          className="w-20 text-xs p-1 border rounded"
        >
          {wireThicknessOptions.map((thickness) => (
            <option key={thickness} value={thickness}>
              {thickness}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="სიგრძე"
          value={wireParams[wireId]?.length || "15"}
          onChange={(e) => updateWireParams(wireId, "length", e.target.value)}
          className="w-12 text-xs p-1 border rounded"
        />
        <span className="text-xs flex items-center">მ</span>
      </div>
    </foreignObject>
  );

  const calculateSvgWidth = (elements) => {
    return Math.max(1200, elements * 120 + 500);
  };

  const renderDeviceControls = (deviceId, deviceName, yOffset) => (
    <foreignObject x="-50" y={yOffset} width="100" height="100">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="text-center bg-white border p-2 rounded-md shadow-sm"
      >
        <div className="text-xs font-medium mb-2">{deviceName}</div>
        <select
          className="text-xs p-1 w-20 mb-2 border rounded"
          value={devicePowers[deviceId]}
          onChange={(e) =>
            updateDevicePower(deviceId, parseInt(e.target.value))
          }
        >
          {powerOptions.map((power) => (
            <option key={power} value={power}>
              {power}W
            </option>
          ))}
        </select>
        <div className="flex items-center justify-center gap-1">
          <input
            type="checkbox"
            checked={smartDevices[deviceId]}
            onChange={() => toggleSmartDevice(deviceId)}
            className="w-3 h-3"
          />
          <span className="text-xs">ჭკვიანი</span>
        </div>
      </div>
    </foreignObject>
  );

  const renderMainPanel = () => {
    const calculateRoomHeight = (room) => {
      const standardSocketsHeight = 120;
      const powerSocketSpacing = 160;
      const powerSocketsHeight =
        parseInt(room.powerSockets || 0) * powerSocketSpacing;
      const lightsHeight = 320;
      const roomPadding = 120;
      return (
        standardSocketsHeight + powerSocketsHeight + lightsHeight + roomPadding
      );
    };

    const calculatePreviousRoomsHeight = (index) => {
      return rooms
        .slice(0, index)
        .reduce((total, room) => total + calculateRoomHeight(room), 0);
    };

    const totalHeight = rooms.reduce(
      (acc, room) => acc + calculateRoomHeight(room),
      0
    );

    const panelHeight = Math.max(1200, totalHeight + 200);
    const circuitStartX = 550;

    const maxWidth = Math.max(
      ...rooms.map((room) =>
        Math.max(
          calculateSvgWidth(
            parseInt(room.standardSockets || 0) +
              parseInt(room.powerSockets || 0)
          ),
          calculateSvgWidth(parseInt(room.lights))
        )
      ),
      1200
    );

    return (
      <div className="mb-10 text-center">
        <h3 className="text-lg font-medium mb-2 read-the-docs">
          ელექტრო სქემა
        </h3>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${maxWidth}px` }}>
            <svg
              viewBox={`0 0 ${maxWidth} ${panelHeight}`}
              className="w-full border rounded"
            >
              {/* კარადის კორპუსი */}
              <rect
                x="150"
                y="20"
                width="200"
                height={panelHeight - 40}
                fill="#d1d5db"
                stroke="black"
              />

              {/* კარადის სათაური */}
              <text
                x="250"
                y="45"
                textAnchor="middle"
                style={{ fontSize: "16px", fontWeight: "bold", fill: "black" }}
              >
                მთავარი კარადა
              </text>

              {/* მთავარი ავტომატი და შემომავალი ხაზი */}
              <g transform="translate(0, 0)">
                <image
                  href={images.automat}
                  x="220"
                  y="100"
                  width="60"
                  height="40"
                />
                <text
                  x="250"
                  y="85"
                  textAnchor="middle"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    fill: "black",
                  }}
                >
                  კვება
                </text>

                {/* შემომავალი ხაზი */}
                <line
                  x1="280"
                  y1="122"
                  x2={circuitStartX}
                  y2="122"
                  stroke="red"
                  strokeWidth="2"
                />

                {/* მავთულის პარამეტრები შემომავალი ხაზისთვის */}
                {renderWireParams("main-power-wire", 355, 90)}
              </g>

              {/* ოთახების წრედები */}
              {rooms.map((room, index) => {
                const baseY = 280 + calculatePreviousRoomsHeight(index);
                const standardSockets = parseInt(room.standardSockets || 0);
                const powerSockets = parseInt(room.powerSockets || 0);
                const lights = parseInt(room.lights);
                const automatOffset = 100;

                return (
                  <g key={room.id}>
                    {/* ოთახის სახელი */}
                    <text
                      x="250"
                      y={baseY - 50}
                      textAnchor="middle"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        fill: "black",
                      }}
                    >
                      {room.roomName}
                    </text>

                    {/* სტანდარტული როზეტების წრედი */}
                    {standardSockets > 0 && (
                      <g>
                        <image
                          href={images.automatOrdinary}
                          x="220"
                          y={baseY}
                          width="60"
                          height="40"
                        />
                        <text
                          x="250"
                          y={baseY - 10}
                          textAnchor="middle"
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            fill: "black",
                          }}
                        >
                          სტ.როზეტები
                        </text>

                        <line
                          x1="280"
                          y1={baseY + 20}
                          x2={circuitStartX}
                          y2={baseY + 20}
                          stroke="black"
                          strokeWidth="2"
                        />
                        {renderWireParams(
                          `${room.id}-standard-wire`,
                          355,
                          baseY - 10
                        )}
                        <line
                          x1={circuitStartX}
                          y1={baseY + 20}
                          x2={circuitStartX + (standardSockets - 1) * 120 + 20}
                          y2={baseY + 20}
                          stroke="black"
                          strokeWidth="2"
                        />

                        {[...Array(standardSockets)].map((_, i) => {
                          const x = circuitStartX + i * 120;
                          const socketId = `${room.id}-standard-socket-${i}`;
                          return (
                            <g
                              key={socketId}
                              transform={`translate(${x}, ${baseY})`}
                            >
                              <image
                                href={images.standardSocket}
                                x="-20"
                                y="0"
                                width="40"
                                height="40"
                              />
                              {smartDevices[socketId] && (
                                <rect
                                  x="-5"
                                  y="-5"
                                  width="10"
                                  height="10"
                                  fill="green"
                                />
                              )}
                              {renderDeviceControls(
                                socketId,
                                `როზეტი ${i + 1}`,
                                45
                              )}
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* მძლავრი როზეტების წრედები */}
                    {[...Array(powerSockets)].map((_, i) => {
                      const y = baseY + 180 + i * 160;
                      const socketId = `${room.id}-power-socket-${i}`;
                      return (
                        <g key={socketId}>
                          <image
                            href={images.automatOrdinary}
                            x="220"
                            y={y}
                            width="60"
                            height="40"
                          />
                          <text
                            x="250"
                            y={y - 10}
                            textAnchor="middle"
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              fill: "black",
                            }}
                          >
                            მძლ.როზეტი {i + 1}
                          </text>
                          <line
                            x1="280"
                            y1={y + 20}
                            x2={circuitStartX}
                            y2={y + 20}
                            stroke="black"
                            strokeWidth="2"
                          />
                          {renderWireParams(
                            `${room.id}-power-wire-${i}`,
                            355,
                            y - 10
                          )}

                          <g transform={`translate(${circuitStartX}, ${y})`}>
                            <image
                              href={images.standardSocket}
                              x="-20"
                              y="0"
                              width="40"
                              height="40"
                            />
                            {smartDevices[socketId] && (
                              <rect
                                x="-5"
                                y="-5"
                                width="10"
                                height="10"
                                fill="green"
                              />
                            )}
                            {renderDeviceControls(
                              socketId,
                              `მძლავრი ${i + 1}`,
                              45
                            )}
                          </g>
                        </g>
                      );
                    })}

                    {/* განათების წრედი */}
                    <g>
                      <image
                        href={images.automatOrdinary}
                        x="220"
                        y={baseY + automatOffset + powerSockets * 160 + 200}
                        width="60"
                        height="40"
                      />
                      <text
                        x="250"
                        y={baseY + automatOffset + powerSockets * 160 + 190}
                        textAnchor="middle"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          fill: "black",
                        }}
                      >
                        განათება
                      </text>

                      <line
                        x1="280"
                        y1={baseY + automatOffset + powerSockets * 160 + 220}
                        x2={circuitStartX}
                        y2={baseY + automatOffset + powerSockets * 160 + 220}
                        stroke="red"
                        strokeWidth="2"
                      />
                      {renderWireParams(
                        `${room.id}-light-wire`,
                        355,
                        baseY + automatOffset + powerSockets * 160 + 190
                      )}
                      <line
                        x1={circuitStartX}
                        y1={baseY + automatOffset + powerSockets * 160 + 220}
                        x2={circuitStartX + (lights - 1) * 120 + 20}
                        y2={baseY + automatOffset + powerSockets * 160 + 220}
                        stroke="blue"
                        strokeWidth="2"
                      />

                      {[...Array(lights)].map((_, i) => {
                        const x = circuitStartX + i * 120;
                        const lightId = `${room.id}-light-${i}`;
                        return (
                          <g
                            key={lightId}
                            transform={`translate(${x}, ${
                              baseY + automatOffset + powerSockets * 160 + 220
                            })`}
                          >
                            <image
                              href={images.light}
                              x="-20"
                              y="-20"
                              width="40"
                              height="40"
                            />
                            {smartDevices[lightId] && (
                              <rect
                                x="-5"
                                y="-25"
                                width="10"
                                height="10"
                                fill="green"
                              />
                            )}
                            {renderDeviceControls(
                              lightId,
                              `სანათი ${i + 1}`,
                              25
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
          <h2 className="text-2xl font-bold text-center mb-6">
            ელექტრო სქემის დაგეგმარება
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
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
                  placeholder="სტანდარტული როზეტები"
                  className="pl-10 p-2 border rounded w-full"
                  value={currentRoom.standardSockets}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      standardSockets: e.target.value,
                    })
                  }
                />
              </div>
              <div className="relative">
                <Zap
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  placeholder="მძლავრი როზეტები"
                  className="pl-10 p-2 border rounded w-full"
                  value={currentRoom.powerSockets}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      powerSockets: e.target.value,
                    })
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
