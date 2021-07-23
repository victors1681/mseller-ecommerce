interface OrderStatusResponse {
  title: string;
  color: string;
}
interface OrderStatusFormat {
  [key: string]: OrderStatusResponse;
}

export const getOrderStatusFormat = (status: string): OrderStatusResponse => {
  console.log('status', status);
  const wooStatus = {
    PENDING: {title: 'Pendiente', color: '#f2c458'},
    PROCESSING: {title: 'Procesando', color: '#99ce43'},
    ON_HOLD: {title: 'En Espera', color: '#a5a5a5'},
    COMPLETED: {title: 'Completada', color: '#77b2d9'},
    CANCELLED: {title: 'Cancelada', color: '#a43832'},
    REFUNDED: {title: 'Devuelta', color: '#a5a5a5'},
    FAILED: {title: 'Ha Fallado', color: '#d1be55'},
  } as OrderStatusFormat;

  return wooStatus[status] || {title: 'Pendiente', color: ''};
};
