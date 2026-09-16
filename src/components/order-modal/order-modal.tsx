import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, OrderInfo } from '@components';

export const OrderModal: FC = () => {
  const { number } = useParams();
  const navigate = useNavigate();

  return (
    <Modal
      title={<span className='text text_type_digits-default'>#{number}</span>}
      onClose={() => navigate(-1)}
    >
      <OrderInfo />
    </Modal>
  );
};
