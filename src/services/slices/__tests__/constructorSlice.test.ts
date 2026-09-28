import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  setBun,
  clearConstructor,
  moveIngredient
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('constructorReducer', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен добавить ингредиент в массив', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockMain._id);
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('должен удалить ингредиент по id', () => {
    const addedState = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    const ingredientId = addedState.ingredients[0].id;

    const state = constructorReducer(
      addedState,
      removeIngredient(ingredientId)
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен установить булку', () => {
    const state = constructorReducer(initialState, setBun(mockBun));
    expect(state.bun).toEqual(mockBun);
  });

  test('должен очистить конструктор', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [{ ...mockMain, id: '1' }]
    };
    const state = constructorReducer(stateWithData, clearConstructor());
    expect(state.bun).toBe(null);
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен поменять ингредиенты местами', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockMain));
    const state2 = constructorReducer(state1, addIngredient(mockBun));

    expect(state2.ingredients[0]._id).toBe(mockMain._id);
    expect(state2.ingredients[1]._id).toBe(mockBun._id);

    const state3 = constructorReducer(
      state2,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state3.ingredients[0]._id).toBe(mockBun._id);
    expect(state3.ingredients[1]._id).toBe(mockMain._id);
  });
});
