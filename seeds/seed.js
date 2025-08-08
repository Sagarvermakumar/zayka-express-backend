import { faker } from "@faker-js/faker";
import Address from "../Models/Address.js";
import MenuItem from "../Models/MenuItem.js";
import Order from "../Models/Order.js";
import User from "../Models/User.js";

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const lastMonth = currentMonth === 0 ? 11 : currentMonth - 2;
const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

const fromDate = new Date(lastMonthYear, lastMonth, 1);
const toDate = new Date(lastMonthYear, lastMonth + 1, 0);

// ✅ Correct usage with from & to
const createdAt = faker.date.between({ from: fromDate, to: toDate });

const getFakeUserData = () => {
  return {
    avatar:{
         public_id: faker.image.avatar(),
        url: faker.image.url({width:"120px",height:"120px"}),
    },
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: "password123", // Will be hashed by pre-save hook
    phoneNumber: faker.helpers.fromRegExp("+91[6-9][0-9]{9}"),
    referralCode: faker.string.alphanumeric(8),
    referredBy: faker.helpers.maybe(() => faker.string.alphanumeric(8), {
      probability: 0.3,
    }),
    walletBalance: faker.finance.amount(0, 500, 0),
    role: faker.helpers.arrayElement(["User",  "User"]),
    status: faker.helpers.arrayElement(["active", "blocked"]),
    isVerified: faker.datatype.boolean(),
    lastLogin: faker.date.recent({ days: 10 }),
     createdAt,
  };
};

export const saveInDbFakeUsers = async (count = 5) => {
  try {
    const users = [];

    for (let i = 0; i < count; i++) {
      const fakeUser = new User(getFakeUserData());
      await fakeUser.save(); // Save to hash password and generate timestamps
      users.push(fakeUser);
    }

    console.log(`✅ Seeded ${users.length} users`);
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed users:", err);
    process.exit(1);
  }
};















export const generateRandomOrderData = async (count = 6) => {
  const users = await User.find({});
  const menuItems = await MenuItem.find({});

  if (!users.length || !menuItems.length) {
    console.log("Add some users and menu items before seeding orders.");
    return;
  }

  let fakeOrders = [];

  for (let i = 0; i < count; i++) {
    //  Select a random user
    const user = faker.helpers.arrayElement(users);

    //  Check if user has at least one address
    const address = await Address.findOne({ user: user._id });
    if (!address) {
      console.log(`⛔ Skipping user ${user.name} (No address found)`);
      continue;
    }

    // Create fake order for this user
    const fakeOrder = new Order({
      userID: user._id,
      items: Array.from({
        length: faker.helpers.rangeToNumber({ min: 1, max: 3 }),
      }).map(() => ({
        item: faker.helpers.arrayElement(menuItems)._id,
        quantity: faker.helpers.rangeToNumber({ min: 1, max: 3 }),
      })),
      totalPrice: faker.finance.amount(100, 1000, 2),
      
      referralDiscountApplied: faker.datatype.boolean(),
      paymentMethod: faker.helpers.arrayElement(["COD", "Online"]),
      status: faker.helpers.arrayElement([
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ]),
      deliveryTime: faker.date.soon({ days: 1 }),
      walletUsed: 15,
      cancelledAt: faker.date.recent({ days: 1 }),
      deliveredAt: faker.date.future({ days: 1 }),
      deliveryAddressID: address._id, 
      createdAt
    });

    fakeOrders.push(fakeOrder);
  }

  // Insert all valid fake orders
  if (fakeOrders.length) {
    await Order.insertMany(fakeOrders);
    console.log(`${fakeOrders.length} fake orders created ✅`);
  } else {
    console.log("No valid users with addresses found ❌");
  }
};







 export const generateMenuItems = async (count = 5) => {
  try {
  
    // await MenuItem.deleteMany(); // Optional: clean slate
    const categories = ["Appetizer", "Main Course", "Dessert"];

 const user = await User.find({}).select('_id')
      for (let i = 0; i < count; i++) {
        const menuItem = new MenuItem({
          createdBy: faker.helpers.arrayElement(user),
          name: faker.food.dish(),
          description: faker.food.description(),
          price: faker.number.float({ min: 50, max: 500, precision: 1 }),
   
          image: faker.image.urlLoremFlickr({ category: "food" }),
          category: faker.helpers.arrayElement(categories),
          isVegetarian: faker.datatype.boolean(),
          isVegan: faker.datatype.boolean(),
          ratings: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
          reviews: faker.number.int({ min: 0, max: 200 }),
          isAvailable: faker.datatype.boolean(),
          createdAt
        });

        await menuItem.save();
        console.log(`🍽️ Menu item added `);
      
    }

    console.log("✅ Menu items seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ MenuItem seeding error:", err.message);
    process.exit(1);
  }
};


const getFakeAddressData = (id) => ({
  
    user:id,
  label:"Work",
  addressLine: faker.location.streetAddress(),
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  country: faker.location.country(),
  pinCode: faker.location.zipCode(),
  landmark: faker.location.streetAddress(),
  geo: {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  },
});
// set address of all users 
export const setRandomGeneratedAddressInEachUser = async ()=>{

  const userIds = await User.find({}).select('_id');
for (let i = 0; i < userIds.length; i++) {

  const address = getFakeAddressData(userIds[i]._id);

  await Address.create(address)


  console.log("Address Created")

}
}



//clear database
export const clearDb = async ()=>{
  await User.deleteMany();
  console.log("user Cleared");

  
  await Address.deleteMany();
  console.log("Address Cleared");

  
  await MenuItem.deleteMany();
  console.log("Menu Cleared");

  await Order.deleteMany();
  console.log("Order Cleared");


  
}