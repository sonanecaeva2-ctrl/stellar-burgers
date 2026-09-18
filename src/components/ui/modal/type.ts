import { ReactNode } from 'react';

export type TModalUIProps = {
  title: ReactNode;
  onClose: () => void;
  children?: ReactNode;
};
