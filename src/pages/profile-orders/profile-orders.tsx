import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrders,
  selectOrdersLoading,
  fetchGetOrders
} from '../../services/slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
