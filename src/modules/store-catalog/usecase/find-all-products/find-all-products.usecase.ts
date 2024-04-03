import UseCaseInterface from "../../../@shared/domain/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsDTO } from "./find-all-product.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {
  constructor(private productRepository: ProductGateway) {}

  async execute(): Promise<FindAllProductsDTO> {
    const products = await this.productRepository.findAll();
    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
