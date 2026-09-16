import { ReactNode } from 'react';

export type TModalProps = {
  title: ReactNode;
  onClose: () => void;
  children?: ReactNode;
};
