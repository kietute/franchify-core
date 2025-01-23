import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from '@/entities/cart.entity';
import { CartDetail } from '@/entities/cartDetail.entity';
import { ProductRepo } from '@/products/products.repo';
import { Repository } from 'typeorm';

describe('CartService', () => {
  let service: CartService;
  let cartRepo: Repository<Cart>;
  let cartDetailRepo: Repository<CartDetail>;
  let productRepo: ProductRepo;

  const cartMock = {
    id: 1,
    userId: 1,
    cartDetails: [
      {
        id: 1,
        quantity: 1,
        createdAt: new Date(),
        cart: { id: 1 } as any,
        product: { id: 1, name: 'Product 1' } as any,
      },
      {
        id: 2,
        quantity: 2,
        createdAt: new Date(),
        cart: { id: 1 } as any,
        product: { id: 1, name: 'Product 1' } as any,
      },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: 1, name: 'John Doe' } as any,
  };

  const productMock = {
    id: 1,
    name: 'Product 1',
    price: 100,
    quantity: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CartDetail),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProductRepo,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepo = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartDetailRepo = module.get<Repository<CartDetail>>(
      getRepositoryToken(CartDetail),
    );
    productRepo = module.get<ProductRepo>(ProductRepo);

    jest.spyOn(cartRepo, 'findOne').mockResolvedValue(cartMock as any);
    jest.spyOn(cartRepo, 'findOneBy').mockResolvedValue(cartMock as any);
    jest.spyOn(cartRepo, 'save').mockResolvedValue(cartMock as any);
    jest.spyOn(cartRepo, 'create').mockReturnValue(cartMock as any);
    jest.spyOn(cartRepo, 'remove').mockResolvedValue(cartMock as any);
    jest.spyOn(cartRepo, 'delete').mockResolvedValue(cartMock as any);
    jest.spyOn(productRepo, 'findOne').mockResolvedValue(productMock as any);
    jest
      .spyOn(cartDetailRepo, 'create')
      .mockReturnValue(cartMock.cartDetails[0] as any);
    jest
      .spyOn(cartDetailRepo, 'save')
      .mockResolvedValue(cartMock.cartDetails[0] as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cart details when findOne is called', async () => {
    const result = await service.getCartById(1);
    expect(result).toEqual(cartMock);
  });

  it('should return cart details when getCart is called', async () => {
    const result = await service.getCart({ id: 1, name: 'Kiet' } as any);
    expect(result).toEqual(cartMock);
  });

  it('should success add product to cart', async () => {
    const result = await service.addProductToCart(
      { productId: 1, quantity: 1, cartId: 1 },
      { id: 1, name: 'Kiet' } as any,
    );

    console.log('result is', result);
    expect(result).toBeDefined();
  });
});
