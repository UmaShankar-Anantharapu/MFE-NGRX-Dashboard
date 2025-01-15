// shared/store/reducer.ts

import { createReducer, on } from '@ngrx/store';
import { updateChartOptions } from '../actions/action';
import { ChartOptionsState } from '../states/state'

export const chartInitialState: ChartOptionsState = {
  type: 'initial value'
}

export const chartReducer = createReducer(
  chartInitialState,
  on(updateChartOptions, (state, {data} ) =>( { ...data } ))
)
