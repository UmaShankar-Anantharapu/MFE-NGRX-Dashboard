import { createAction, props } from '@ngrx/store';
import { ChartOptionsState } from '../states/state';

export const updateChartOptions = createAction('[Chart] update Chart Options', props<{data: ChartOptionsState}>())