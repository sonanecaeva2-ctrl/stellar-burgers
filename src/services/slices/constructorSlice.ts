import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() } as TConstructorIngredient
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    }
  },
  selectors: {
    selectConstructorBun: (state: TConstructorState) => state.bun,
    selectConstructorIngredients: (state: TConstructorState) =>
      state.ingredients,
    selectConstructorItems: (state: TConstructorState) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;

export const {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorItems
} = constructorSlice.selectors;

export default constructorSlice.reducer;
