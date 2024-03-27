// slices/statementsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadStatements } from '../lib/api';
import { RootState } from '.';

export type Statement = {
  id: string;
  name: string;
  contactInformation: Record<string, any>;
};

type StatementsState = {
  statements: Statement[];
  loading: boolean;
};

const initialState: StatementsState = {
  statements: [],
  loading: false,
};

export const fetchStatements = createAsyncThunk('statements/fetchStatements', async () => {
  const response = await loadStatements();
  return response.data;
});

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatements.fulfilled, (state, action) => {
        state.statements = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatements.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectStatements = (state: RootState) => state.statements.statements;
export const selectLoading = (state: RootState) => state.statements.loading;

export default statementsSlice;
