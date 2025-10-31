// components/ProgressRing.tsx
import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  size?: number;
  stroke?: number;
  percent: number;         // 0..100
  color: string;           // cor do progresso
  track?: string;          // cor do trilho
  text?: string;           // texto central
  textColor?: string;
};

export default function ProgressRing({
  size = 200,
  stroke = 16,
  percent,
  color,
  track = "#EEF2F7",
  text,
  textColor = "#1F2937",
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = (clamped / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash}, ${circumference - dash}`}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {!!text && <Text style={{ fontSize: 32, fontWeight: "800", color: textColor }}>{text}</Text>}
    </View>
  );
}
