import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchGetOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrdersLoading: (state) => state.isLoading,
    selectOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchGetOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const { selectOrders, selectOrdersLoading, selectOrdersError } =
  ordersSlice.selectors;

export default ordersSlice.reducer;
