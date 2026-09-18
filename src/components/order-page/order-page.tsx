import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '@components';

export const OrderPage: FC = () => {
  const { number } = useParams();

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <p className='text text_type_digits-default mb-4'>#{number}</p>
      <OrderInfo />
    </div>
  );
};
