export interface BookingType {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: Date;
  rent_end_date: Date;
  total_price: number;
  status: string;
}
