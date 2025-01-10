import { SubtitleOptions, TitleOptions, TooltipOptions } from "highcharts";

export interface ChartOptionsState{
    id?: string;
    type?: string;
    dataset?: string;
    title?: TitleOptions;
    subTitle?: SubtitleOptions;
    tooltip?: TooltipOptions;
    xAxis?: axisConfiguration;
    yAxis?: { title?: string, seriesConf?: axisConfiguration[], isStackable?: boolean }[];
    seriesConfigurations?: {
        label?: string, value?: string
    }
    windRoseFrequencies?: string[];
    yTitle?: string;
    threeDOptions?: {
        enabled: boolean;
        alpha?: number;
        beta?: number;
        depth?: number;
        viewDistance?: number;
        innerSize?: string;
    };
    isDrillDownEnabled?: boolean;
    drillDownOptions?: drillDownOptions[];
}

export interface axisConfiguration{
    axisName?: string;
    axisKey?: string;
    isStackable?: boolean;
    chartType?: string;
}

export interface drillDownOptions {
    drillDownLevel?: number;
    nestedAttr?: string;
    xAxis?: axisConfiguration;
    yAxis?: axisConfiguration;
    axisName?: string
    seriesConfigurations?: {
        label?: string, value?: string
    }
}