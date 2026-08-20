import { DiscountType ,Discount,DiscountSchema} from "../schemas/discounts.schema";
import mongoose from "mongoose";
const discounts = [
  {
    code: 'SAVE10',
    type: DiscountType.PERCENT,
    value: 10,
    minCartValue: 1000,
    maxDiscount: 500,
    active: true,
  },
  {
    code: 'SAVE20',
    type: DiscountType.PERCENT,
    value: 20,
    minCartValue: 3000,
    maxDiscount: 1000,
    active: true,
  },
  {
    code: 'FLAT500',
    type: DiscountType.FLAT,
    value: 500,
    minCartValue: 5000,
    active: true,
  },
];


async function seed() {
  const mongoUri = `mongodb://manimaransrinivasan35_db_user:Maransjc123^6@ac-kjn9elo-shard-00-00.mekezgj.mongodb.net:27017,ac-kjn9elo-shard-00-01.mekezgj.mongodb.net:27017,ac-kjn9elo-shard-00-02.mekezgj.mongodb.net:27017/ecommerce-chat-application?ssl=true&replicaSet=atlas-e5t3ph-shard-0&authSource=admin&appName=learningMongo`;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(mongoUri);

  const DiscountModel = mongoose.model(Discount.name, DiscountSchema);

  await DiscountModel.deleteMany({});

  await DiscountModel.insertMany(discounts);

  console.log(`Seeded ${discounts.length} products`);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);

  await mongoose.disconnect();

  process.exit(1);
});