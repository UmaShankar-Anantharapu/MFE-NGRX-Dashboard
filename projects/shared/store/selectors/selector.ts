import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GlobalState } from '../states/state';


export const selectChartState = createFeatureSelector<GlobalState>('chart');

// Selector for chartData
export const selectChartData = createSelector(
    selectChartState,
    (state) => state.chart
);

// Selector for chartOptions
export const selectDashboardData = createSelector(
    selectChartState,
    (state) => state.dashboard
);
