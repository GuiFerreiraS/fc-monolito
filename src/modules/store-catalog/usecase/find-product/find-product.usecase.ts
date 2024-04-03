import ProductGateway from "../../gateway/product.gateway";
import { FindProductInputDTO, FindProductOutputDTO } from "./find-product.dto";

export default class FindProductUseCase {
  constructor(private productRepository: ProductGateway) {
    this.productRepository = productRepository;
  }

  async execute(input: FindProductInputDTO): Promise<FindProductOutputDTO> {
    const product = await this.productRepository.find(input.id);
    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
