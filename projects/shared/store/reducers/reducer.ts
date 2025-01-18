// shared/store/reducer.ts

import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { updateChartOptions } from '../actions/chart.action';
import { ChartOptionsState, GlobalState } from '../states/state'
import { updateDashboard } from '../actions/dashboard.action';

export const chartInitialState: ChartOptionsState = {
}
export const dashboardInitialState: ChartOptionsState = {
}

export const chartReducer = createReducer(
  chartInitialState,
  on(updateChartOptions, (state, {data} ) =>( { ...state,chart:{...data} } ))
)

export const dashboardReducer = createReducer(
  dashboardInitialState,
  on(updateDashboard,(state,{data})=>({...state,dashbord:data}))
)

export const reducers: ActionReducerMap<GlobalState> = {
  chart: (state = chartInitialState, action) => chartReducer(state, action), // Handles undefined state
  dashboard: (state = dashboardInitialState, action) =>
  dashboardReducer(state, action), // Handles undefined state
};

