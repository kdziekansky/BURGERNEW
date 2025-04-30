import React, { FC } from 'react';
import { OrderStatusUIProps } from './type';

export const OrderStatusUI: FC<OrderStatusUIProps> = ({ textStyle, text }) => (
  <p
    className='text text_type_main-default'
    style={{
      color: textStyle,
      textAlign: 'left',
      marginTop: '10px',
      marginBottom: '20px'
    }}
  >
    {text}
  </p>
);
