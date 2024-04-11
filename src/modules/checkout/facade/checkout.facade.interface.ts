export interface PlaceOrderFacadeInputDTO {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderFacadeOutputDTO {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}

export default interface CheckoutFacadeInterface {
  placeOrder(
    input: PlaceOrderFacadeInputDTO
  ): Promise<PlaceOrderFacadeOutputDTO>;
}
