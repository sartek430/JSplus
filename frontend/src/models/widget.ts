export enum EWidgetSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
}

export interface IWidgetDb {
  id: number;
  displayName: string;
  latitude: number;
  longitude: number;
  size: EWidgetSize;
}

export interface IWidget extends IWidgetDb {
  temperature: number;
  isSunny: boolean;
  isCloudy: boolean;
  isRainy: boolean;
  humidity: number;
  wind: number;
}

