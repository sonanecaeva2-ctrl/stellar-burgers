import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const fetchOrderByNumber = createAsyncThunk(
  'orderInfo/fetch',
  async (number: number) => getOrderByNumberApi(number)
);

type TOrderInfoState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  orderData: null,
  isLoading: false,
  error: null
};

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  selectors: {
    selectOrderData: (state) => state.orderData,
    selectOrderInfoLoading: (state) => state.isLoading,
    selectOrderInfoError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      });
  }
});

export const { selectOrderData, selectOrderInfoLoading, selectOrderInfoError } =
  orderInfoSlice.selectors;

export default orderInfoSlice.reducer;
