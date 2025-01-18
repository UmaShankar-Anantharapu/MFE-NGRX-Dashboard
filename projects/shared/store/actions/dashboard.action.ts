import { createAction, props } from '@ngrx/store';
import { DashboardState } from '../states/state';
export const updateDashboard = createAction('[DASHBOARD] update Dashboard Options', props<{data: DashboardState}>())