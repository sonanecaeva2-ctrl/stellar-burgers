import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const PublicRoute: FC = () => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
