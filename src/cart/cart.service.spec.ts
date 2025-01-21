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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests for other methods here
});
