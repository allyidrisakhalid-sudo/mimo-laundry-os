export type OrderChannel = "DOOR" | "SHOP" | "HYBRID";

export function isOrderChannel(value: string): value is OrderChannel {
  return value === "DOOR" || value === "SHOP" || value === "HYBRID";
}

export * from "./formatters";
