// App/components/CircuitDiagram/constants.js
export const MANUFACTURERS = {
  COMPONENTS: [
    "Schneider-electric",
    "ABB",
    "Legrand",
    "Siemens",
    "Hager",
    "IEK",
  ],
  CABLES: ["საქკაბელი", "LAPP", "Erse Kablo"],
};

export const PRICES = {
  standardSocket: { price: 12 },
  powerSocket: { price: 15 },
  light: { price: 25 },
  cabinet: { price: 300, manufacturer: "Schneider-electric" },
  cabinetAssembly: { price: 200 },
  wireTypes: {
    "3X1.5": { price: 2.5 },
    "3X2.5": { price: 3.5 },
    "3X4": { price: 4.5 },
    "3X6": { price: 6.0 },
    "5X6": { price: 8.0 },
  },
};

// App/components/PriceCalculatorModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const TableHeader = ({ children }) => (
  <div className="text-xs text-red-500">{children}</div>
);

const TableCell = ({ children, className = "" }) => (
  <div className={`text-xs ${className}`}>{children}</div>
);

const ManufacturerSelect = ({ value, onChange, type = "COMPONENTS" }) => (
  <select
    className="w-full text-xs border border-gray-300 rounded px-1 py-0.5"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {MANUFACTURERS[type].map((m) => (
      <option key={m} value={m}>
        {m}
      </option>
    ))}
  </select>
);

export const PriceCalculatorModal = ({
  isOpen,
  onClose,
  rooms,
  wireParams,
}) => {
  if (!isOpen) return null;

  const [manufacturers, setManufacturers] = useState({
    standardSocket: MANUFACTURERS.COMPONENTS[0],
    powerSocket: MANUFACTURERS.COMPONENTS[0],
    light: MANUFACTURERS.COMPONENTS[0],
    wires: {},
  });

  const calculateTotals = () => {
    let standardSocketsCount = 0;
    let powerSocketsCount = 0;
    let lightsCount = 0;
    let wireLengthsByType = {};

    rooms.forEach((room) => {
      standardSocketsCount += parseInt(room.standardSockets || 0);
      powerSocketsCount += parseInt(room.powerSockets || 0);
      lightsCount += parseInt(room.lights || 0);
    });

    Object.entries(wireParams).forEach(([wireId, params]) => {
      const { thickness, length } = params;
      wireLengthsByType[thickness] =
        (wireLengthsByType[thickness] || 0) + parseFloat(length);

      if (!manufacturers.wires[thickness]) {
        setManufacturers((prev) => ({
          ...prev,
          wires: {
            ...prev.wires,
            [thickness]: MANUFACTURERS.CABLES[0],
          },
        }));
      }
    });

    const standardSocketsTotal =
      standardSocketsCount * PRICES.standardSocket.price;
    const powerSocketsTotal = powerSocketsCount * PRICES.powerSocket.price;
    const lightsTotal = lightsCount * PRICES.light.price;
    const wiringTotal = Object.entries(wireLengthsByType).reduce(
      (total, [type, length]) => total + length * PRICES.wireTypes[type].price,
      0
    );

    return {
      standardSocketsCount,
      powerSocketsCount,
      lightsCount,
      wireLengthsByType,
      standardSocketsTotal,
      powerSocketsTotal,
      lightsTotal,
      wiringTotal,
      subtotal:
        standardSocketsTotal +
        powerSocketsTotal +
        lightsTotal +
        wiringTotal +
        PRICES.cabinet.price +
        PRICES.cabinetAssembly.price,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">ფასების კალკულაცია</h2>
            <button onClick={onClose}>
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="divide-y divide-red-500 divide-dashed">
            {/* კომპონენტები */}
            <div className="pb-4">
              <div className="grid grid-cols-5 gap-4 mb-2 text-center">
                <TableHeader>კომპონენტები:</TableHeader>
                <TableHeader>მწარმოებელი</TableHeader>
                <TableHeader>რაოდენობა</TableHeader>
                <TableHeader>ერთ. ფასი</TableHeader>
                <TableHeader>ჯამი</TableHeader>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-4 text-center">
                  <TableCell>სტანდარტული როზეტი</TableCell>
                  <TableCell>
                    <ManufacturerSelect
                      value={manufacturers.standardSocket}
                      onChange={(value) =>
                        setManufacturers((prev) => ({
                          ...prev,
                          standardSocket: value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>{totals.standardSocketsCount}</TableCell>
                  <TableCell>{PRICES.standardSocket.price} ₾</TableCell>
                  <TableCell>{totals.standardSocketsTotal} ₾</TableCell>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center">
                  <TableCell>მძლავრი როზეტი</TableCell>
                  <TableCell>
                    <ManufacturerSelect
                      value={manufacturers.powerSocket}
                      onChange={(value) =>
                        setManufacturers((prev) => ({
                          ...prev,
                          powerSocket: value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>{totals.powerSocketsCount}</TableCell>
                  <TableCell>{PRICES.powerSocket.price} ₾</TableCell>
                  <TableCell>{totals.powerSocketsTotal} ₾</TableCell>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center">
                  <TableCell>სანათის ჩამრთველი</TableCell>
                  <TableCell>
                    <ManufacturerSelect
                      value={manufacturers.light}
                      onChange={(value) =>
                        setManufacturers((prev) => ({
                          ...prev,
                          light: value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>{totals.lightsCount}</TableCell>
                  <TableCell>{PRICES.light.price} ₾</TableCell>
                  <TableCell>{totals.lightsTotal} ₾</TableCell>
                </div>
              </div>
            </div>

            {/* სადენები */}
            <div className="py-4">
              <div className="grid grid-cols-5 gap-4 mb-2 text-center">
                <TableHeader>სადენები:</TableHeader>
                <TableHeader>მწარმოებელი</TableHeader>
                <TableHeader>სიგრძე (მ)</TableHeader>
                <TableHeader>ერთ. ფასი</TableHeader>
                <TableHeader>ჯამი</TableHeader>
              </div>

              <div className="space-y-2">
                {Object.entries(totals.wireLengthsByType).map(
                  ([type, length]) => (
                    <div
                      key={type}
                      className="grid grid-cols-5 gap-4 text-center"
                    >
                      <TableCell>{type}</TableCell>
                      <TableCell>
                        <ManufacturerSelect
                          value={
                            manufacturers.wires[type] || MANUFACTURERS.CABLES[0]
                          }
                          onChange={(value) =>
                            setManufacturers((prev) => ({
                              ...prev,
                              wires: {
                                ...prev.wires,
                                [type]: value,
                              },
                            }))
                          }
                          type="CABLES"
                        />
                      </TableCell>
                      <TableCell>{length}</TableCell>
                      <TableCell>{PRICES.wireTypes[type].price} ₾</TableCell>
                      <TableCell>
                        {(length * PRICES.wireTypes[type].price).toFixed(2)} ₾
                      </TableCell>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* დამატებითი */}
            <div className="pt-4">
              <div className="grid grid-cols-5 gap-4 mb-2 text-center">
                <TableHeader>დამატებითი:</TableHeader>
                <TableHeader>მწარმოებელი</TableHeader>
                <TableHeader>რაოდენობა</TableHeader>
                <TableHeader>ფასი</TableHeader>
                <TableHeader>ჯამი</TableHeader>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-4 text-center">
                  <TableCell>მთავარი კარადა</TableCell>
                  <TableCell>{PRICES.cabinet.manufacturer}</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{PRICES.cabinet.price} ₾</TableCell>
                  <TableCell>{PRICES.cabinet.price} ₾</TableCell>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center">
                  <TableCell>კარადის აწყობა</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{PRICES.cabinetAssembly.price} ₾</TableCell>
                  <TableCell>{PRICES.cabinetAssembly.price} ₾</TableCell>
                </div>
              </div>
            </div>

            {/* ჯამი */}
            <div className="pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">ჯამი:</span>
                <span className="font-medium">
                  {totals.subtotal.toFixed(2)} ₾
                </span>
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-500 text-white text-sm py-2 px-4 rounded mt-6 hover:bg-blue-600">
            შეკვეთის განთავსება
          </button>
        </div>
      </div>
    </div>
  );
};
// App/components/CircuitDiagram.jsx
import { Lamp, Power, Home, Plus, Zap } from "lucide-react";
import standardSocketImage from "../assets/socket.png";
import lightImage from "../assets/light.png";
import automatImage from "../assets/automat.png";
import automatOrdinaryImage from "../assets/automatOrdinary.png";

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
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

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
      <div xmlns="http://www.w3.org/1999/xhtml" className="flex gap-1">
        <select
          value={wireParams[wireId]?.thickness || "3X1.5"}
          onChange={(e) =>
            updateWireParams(wireId, "thickness", e.target.value)
          }
          className="w-16 text-xs p-1 border rounded"
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
      const lightsHeight = 160;
      const roomPadding = 280;
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
                x="130"
                y="20"
                width="240"
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
                  x="200"
                  y="100"
                  width="100"
                  height="65"
                  alt="automat"
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
                  x1="300"
                  y1="134"
                  x2={circuitStartX}
                  y2="134"
                  stroke="red"
                  strokeWidth="2"
                />

                {/* მავთულის პარამეტრები შემომავალი ხაზისთვის */}
                {renderWireParams("main-power-wire", 375, 100)}
              </g>

              {/* ოთახების წრედები */}
              {rooms.map((room, index) => {
                const baseY = 280 + calculatePreviousRoomsHeight(index);
                const standardSockets = parseInt(room.standardSockets || 0);
                const powerSockets = parseInt(room.powerSockets || 0);
                const lights = parseInt(room.lights);

                return (
                  <g key={room.id}>
                    {/* ოთახის კარადის ჩარჩო */}
                    <rect
                      x="160"
                      y={baseY - 30}
                      width="180"
                      height={(powerSockets + 2) * 160 + 100}
                      fill="none"
                      stroke="#666"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    {/* ოთახის სახელი */}
                    <text
                      x="250"
                      y={baseY - 50}
                      textAnchor="middle"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        fill: "red",
                      }}
                    >
                      {room.roomName}
                    </text>

                    {/* სტანდარტული როზეტების წრედი */}
                    {standardSockets > 0 && (
                      <g>
                        <image
                          href={images.automatOrdinary}
                          x="200"
                          y={baseY}
                          width="100"
                          height="65"
                          alt="automat ordinary"
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
                          x1="300"
                          y1={baseY + 34}
                          x2={circuitStartX}
                          y2={baseY + 34}
                          stroke="black"
                          strokeWidth="2"
                        />
                        {renderWireParams(
                          `${room.id}-standard-wire`,
                          375,
                          baseY
                        )}
                        <line
                          x1={circuitStartX}
                          y1={baseY + 34}
                          x2={circuitStartX + (standardSockets - 1) * 120 + 20}
                          y2={baseY + 34}
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
                                y="15"
                                width="40"
                                height="40"
                                alt="standard socket"
                              />
                              {smartDevices[socketId] && (
                                <rect
                                  x="-5"
                                  y="10"
                                  width="10"
                                  height="10"
                                  fill="green"
                                />
                              )}
                              {renderDeviceControls(
                                socketId,
                                `როზეტი ${i + 1}`,
                                60
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
                            x="200"
                            y={y}
                            width="100"
                            height="65"
                            alt="automat ordinary"
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
                            x1="300"
                            y1={y + 34}
                            x2={circuitStartX}
                            y2={y + 34}
                            stroke="black"
                            strokeWidth="2"
                          />
                          {renderWireParams(
                            `${room.id}-power-wire-${i}`,
                            375,
                            y
                          )}

                          <g transform={`translate(${circuitStartX}, ${y})`}>
                            <image
                              href={images.standardSocket}
                              x="-20"
                              y="15"
                              width="40"
                              height="40"
                              alt="standard socket"
                            />
                            {smartDevices[socketId] && (
                              <rect
                                x="-5"
                                y="10"
                                width="10"
                                height="10"
                                fill="green"
                              />
                            )}
                            {renderDeviceControls(
                              socketId,
                              `მძლავრი ${i + 1}`,
                              60
                            )}
                          </g>
                        </g>
                      );
                    })}

                    {/* განათების წრედი */}
                    <g>
                      <image
                        href={images.automatOrdinary}
                        x="200"
                        y={baseY + 60 + (powerSockets + 1) * 160}
                        width="100"
                        height="65"
                        alt="automat ordinary"
                      />
                      <text
                        x="250"
                        y={baseY + 50 + (powerSockets + 1) * 160}
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
                        x1="300"
                        y1={baseY + 94 + (powerSockets + 1) * 160}
                        x2={circuitStartX}
                        y2={baseY + 94 + (powerSockets + 1) * 160}
                        stroke="black"
                        strokeWidth="2"
                      />
                      {renderWireParams(
                        `${room.id}-light-wire`,
                        375,
                        baseY + 60 + (powerSockets + 1) * 160
                      )}
                      <line
                        x1={circuitStartX}
                        y1={baseY + 94 + (powerSockets + 1) * 160}
                        x2={circuitStartX + (lights - 1) * 120 + 20}
                        y2={baseY + 94 + (powerSockets + 1) * 160}
                        stroke="black"
                        strokeWidth="2"
                      />

                      {[...Array(lights)].map((_, i) => {
                        const x = circuitStartX + i * 120;
                        const lightId = `${room.id}-light-${i}`;
                        return (
                          <g
                            key={lightId}
                            transform={`translate(${x}, ${
                              baseY + 94 + (powerSockets + 1) * 160
                            })`}
                          >
                            <image
                              href={images.light}
                              x="-20"
                              y="-20"
                              width="40"
                              height="40"
                              alt="light"
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
                              `სანათის ჩამრთველი ${i + 1}`,
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

        {rooms.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setIsPriceModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2 w-full"
            >
              <Zap size={20} />
              ფასების გამოთვლა
            </button>
          </div>
        )}

        {/* მთავარი სქემა */}
        {rooms.length > 0 && renderMainPanel()}

        {/* ფასების კალკულატორის მოდალი */}
        <PriceCalculatorModal
          isOpen={isPriceModalOpen}
          onClose={() => setIsPriceModalOpen(false)}
          rooms={rooms}
          wireParams={wireParams}
        />
      </div>
    </div>
  );
};

export default CircuitDiagram;
