const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const faker = require("faker"); // For additional dummy data generation
require("dotenv").config();

const mongoString = process.env.MONGODB_URI;

mongoose
  .connect(mongoString, {})
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const UserModel = require("./models/user");
const ArticleModel = require("./models/article");
const ShopItemModel = require("./models/shopItem");
const OrderModel = require("./models/order");

// Function to load image data from a file
function loadImageData(imageNumber) {
  const imagePath = path.join(__dirname, "sample_images", `${imageNumber}.png`);
  const imageBuffer = fs.readFileSync(imagePath);
  return {
    data: imageBuffer,
    contentType: "image/png",
  };
}

// Motorsport-themed data
const teamNames = [
  "Red Bull Racing",
  "Mercedes-AMG Petronas",
  "Scuderia Ferrari",
  "McLaren",
  "Alpine F1 Team",
];
const driverNames = [
  "Max Verstappen",
  "Lewis Hamilton",
  "Charles Leclerc",
  "Lando Norris",
  "Fernando Alonso",
];
const circuitNames = [
  "Monaco",
  "Silverstone",
  "Spa-Francorchamps",
  "Monza",
  "Suzuka",
];
const articleCategories = [
  "F1",
  "MOTOGP",
  "NASCAR",
  "INDYCAR",
  "WEC",
  "WRC",
  "IMSA",
  "DTM",
];
const shopItemTypes = ["T-Shirt", "Hoodie", "Cap", "Mug", "Poster", "Keychain"];
const motorsportIcons = ["Schumacher", "Senna", "Prost", "Vettel", "Alonso"]; // Easter egg usernames

// Function to seed articles
async function seedArticles() {
  const hashedPassword = await bcrypt.hash("adminpassword", 10);
  const articles = [];
  try {
    // Seed Admin User
    const admin = await UserModel.create({
      _id: new mongoose.Types.ObjectId(),
      username: "Admin",
      email: "admin@motorsportnews.com",
      password: hashedPassword,
      role: "admin",
      profileImage: null,
    });

    // F1 Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Verstappen Clinches Dominant Victory at Monaco Grand Prix",
      content:
        "<p>Max Verstappen of Red Bull Racing showcased his exceptional skills and secured a commanding victory at the prestigious Monaco Grand Prix. His flawless driving and strategic pit stops led him to the top step of the podium, solidifying his position as a championship contender.</p><p>The race was filled with thrilling overtakes and unexpected twists, captivating fans worldwide. Verstappen's teammate, Sergio Perez, also delivered a strong performance, finishing in second place and securing valuable points for the team.</p>",
      author: admin._id,
      images: [loadImageData(1)],
      category: "F1",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Hamilton Battles Through Adversity for Podium Finish",
      content:
        "<p>Despite facing numerous challenges throughout the race, Lewis Hamilton of Mercedes-AMG Petronas fought valiantly to secure a well-deserved podium finish at the Monaco Grand Prix. His determination and never-give-up attitude were on full display as he navigated through the tight and twisty street circuit.</p><p>The race saw several incidents and safety car periods, creating a chaotic atmosphere. Hamilton's ability to adapt and stay focused under pressure proved crucial in achieving his impressive result.</p>",
      author: admin._id,
      images: [loadImageData(2)],
      category: "F1",
    });

    // MOTOGP Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Ducati Dominates Italian MOTOGP with Bagnaia's Masterclass",
      content:
        "<p>Francesco Bagnaia of Ducati Lenovo Team displayed his exceptional riding skills and secured a commanding victory at the Italian MOTOGP, much to the delight of the home crowd. His aggressive overtakes and consistent pace throughout the race left his rivals struggling to keep up.</p><p>The race witnessed intense battles for podium positions, with Fabio Quartararo of Monster Energy Yamaha MOTOGP and Marc Marquez of Repsol Honda Team engaging in a thrilling duel. Ultimately, Quartararo emerged victorious in the fight for second place, while Marquez had to settle for third.</p>",
      author: admin._id,
      images: [loadImageData(7)],
      category: "MOTOGP",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title:
        "Marc Marquez Makes Triumphant Return from Injury with Podium Finish",
      content:
        "<p>Marc Marquez, the eight-time world champion, made a remarkable comeback from a long-term injury, securing a podium finish at the Italian MOTOGP. Despite concerns about his fitness, Marquez demonstrated his trademark determination and skill, battling his way to third place.</p><p>The race was marked by Marquez's impressive overtaking maneuvers and his ability to push the limits of his Honda RC213V machine. His performance has sent a clear message to his rivals that he is back in contention for the championship title.</p>",
      author: admin._id,
      images: [loadImageData(8)],
      category: "MOTOGP",
    });

    // NASCAR Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title:
        "Chase Elliott Clinches Thrilling Victory at Talladega Superspeedway",
      content:
        "<p>Chase Elliott, driver of the No. 9 Chevrolet Camaro for Hendrick Motorsports, emerged triumphant in a nail-biting finish at Talladega Superspeedway. Elliott's strategic drafting and a timely last-lap pass secured him the checkered flag, marking his second win of the season.</p><p>The race was characterized by its high speeds, close racing, and numerous lead changes, typical of the intense competition at Talladega. Elliott's win solidifies his position in the NASCAR Cup Series playoffs and cements his reputation as a force to be reckoned with on superspeedways.</p>",
      author: admin._id,
      images: [loadImageData(13)], // Cycle through 3 images (4, 5, 6)
      category: "NASCAR",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Kyle Larson Dominates Coca-Cola 600, Extending Championship Lead",
      content:
        "<p>Kyle Larson, driving the No. 5 Chevrolet Camaro for Hendrick Motorsports, showcased his exceptional talent and versatility by winning the grueling Coca-Cola 600 at Charlotte Motor Speedway. Larson led for the majority of the race, demonstrating his ability to maintain speed and control over long distances.</p><p>This victory marks Larson's third win of the season and extends his lead in the NASCAR Cup Series standings. His dominant performance further solidifies his status as a top contender for the championship title.</p>",
      author: admin._id,
      images: [loadImageData(14)],
      category: "NASCAR",
    });

    // INDYCAR Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Palou Triumphs at Indianapolis 500 in Dramatic Fashion",
      content:
        "<p>Alex Palou, driving for Chip Ganassi Racing, captured a thrilling victory at the Indianapolis 500. His masterful fuel strategy and impressive overtaking maneuvers in the closing laps propelled him to the front, where he held off a charging Pato O'Ward to take the checkered flag.</p><p>The race was marked by its high drama, with several lead changes, caution periods, and close battles throughout the field. Palou's win is a major milestone for the young driver, solidifying his status as a rising star in the INDYCAR Series.</p>",
      author: admin._id,
      images: [loadImageData(19)],
      category: "INDYCAR",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "INDYCAR Unveils New Hybrid Engine for 2024 Season",
      content:
        "<p>INDYCAR has announced the introduction of a new hybrid engine that will be used in the 2024 season. The hybrid system is expected to significantly increase power and efficiency while reducing emissions, aligning the sport with global sustainability goals.</p><p>The new engine is a collaboration between Chevrolet and Honda, the two engine manufacturers currently competing in INDYCAR. It features a kinetic energy recovery system (KERS) and a turbocharged internal combustion engine, promising a significant boost in performance and excitement for drivers and fans alike.</p>",
      author: admin._id,
      images: [loadImageData(21)],
      category: "INDYCAR",
    });

    // WEC Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title:
        "Toyota Gazoo Racing Dominates 24 Hours of Le Mans with 1-2 Finish",
      content:
        "<p>Toyota Gazoo Racing continued their dominance in the World Endurance Championship by securing a resounding 1-2 victory at the legendary 24 Hours of Le Mans. The team's two hybrid hypercars, driven by experienced lineups, displayed incredible speed, reliability, and strategic prowess throughout the grueling endurance race.</p><p>The victory marks Toyota's fifth consecutive win at Le Mans, solidifying their position as the leading force in endurance racing. The team's success is a testament to their commitment to cutting-edge hybrid technology and their relentless pursuit of perfection in one of the most demanding motorsport disciplines.</p>",
      author: admin._id,
      images: [loadImageData(31)],
      category: "WEC",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Female Drivers Make History at 24 Hours of Le Mans",
      content:
        "<p>The 2023 edition of the 24 Hours of Le Mans witnessed a historic moment as an all-female team competed in the prestigious endurance race. The Richard Mille Racing Team, consisting of Tatiana Calderon, Sophia Floersch, and Beitske Visser, showcased their talent and determination, finishing the race in a respectable position.</p><p>The team's participation is a major milestone for female representation in motorsport, inspiring a new generation of female drivers and challenging traditional gender stereotypes. Their achievement demonstrates that talent and skill transcend gender boundaries and that women have a rightful place at the highest levels of motorsport competition.</p>",
      author: admin._id,
      images: [loadImageData(35)],
      category: "WEC",
    });

    // WRC Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Rovanperä Storms to Victory in Challenging Safari Rally",
      content:
        "<p>Kalle Rovanperä, driving for Toyota Gazoo Racing, demonstrated his exceptional rallying skills and secured a well-deserved victory at the demanding Safari Rally in Kenya. His precise car control and fearless driving on the rough and unpredictable gravel roads earned him the top step of the podium.</p><p>The Safari Rally, known for its harsh terrain and unpredictable weather conditions, presented a formidable challenge for the drivers. Rovanperä's ability to adapt to the changing conditions and maintain a consistent pace throughout the event proved to be the key to his success.</p>",
      author: admin._id,
      images: [loadImageData(31)],
      category: "WRC",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Tanak's Dramatic Crash Mars Safari Rally Podium Hopes",
      content:
        "<p>Ott Tänak's hopes of a podium finish at the Safari Rally were dashed after a dramatic crash during the penultimate stage of the event. Tänak, who had been running in third place, lost control of his Hyundai i20 Coupe WRC and rolled several times.</p><p>The incident highlighted the unforgiving nature of the Safari Rally and the risks that rally drivers face on challenging terrain. Fortunately, Tänak and his co-driver emerged from the crash unharmed, but their retirement from the rally was a major disappointment for the Hyundai team.</p>",
      author: admin._id,
      images: [loadImageData(36)],
      category: "WRC",
    });

    // IMSA Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title: "Acura DPi Dominates Rolex 24 at Daytona with Thrilling Victory",
      content:
        "<p>The Acura ARX-06 prototype, fielded by Meyer Shank Racing, claimed a dominant victory at the iconic Rolex 24 at Daytona, kicking off the IMSA WeatherTech SportsCar Championship season in spectacular fashion. The team's experienced driver lineup, including Tom Blomqvist, Helio Castroneves, and Simon Pagenaud, showcased exceptional skill and endurance throughout the grueling 24-hour race.</p><p>The race witnessed intense battles across all classes, with numerous lead changes and dramatic incidents. Acura's win demonstrates their commitment to technological innovation and their unwavering pursuit of excellence in endurance racing.</p>",
      author: admin._id,
      images: [loadImageData(37)],
      category: "IMSA",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title:
        "Cadillac V-LMDh Unveiled, Setting New Standard for Hybrid Performance",
      content:
        "<p>Cadillac Racing has unveiled their latest challenger for the IMSA WeatherTech SportsCar Championship, the V-LMDh prototype. The hybrid-powered car boasts a cutting-edge design and innovative technology, promising to redefine performance and efficiency in endurance racing.</p><p>The V-LMDh, with its sleek lines and aerodynamically optimized bodywork, is a testament to Cadillac's commitment to pushing the boundaries of motorsport engineering. The car's hybrid powertrain, combining a turbocharged internal combustion engine with an electric motor, is expected to deliver exceptional power and responsiveness on the track.</p>",
      author: admin._id,
      images: [loadImageData(39)],
      category: "IMSA",
    });

    // DTM Articles
    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title:
        "Sheldon van der Linde Claims Maiden DTM Title in Thrilling Finale",
      content:
        "<p>Sheldon van der Linde, driving for Schubert Motorsport, secured his first DTM championship title in a dramatic season finale at Hockenheimring. The South African driver showcased his exceptional talent and consistency throughout the year, accumulating enough points to fend off his rivals and claim the coveted crown.</p><p>The championship battle went down to the wire, with several drivers in contention for the title. Van der Linde's victory in the final race sealed his triumph, marking a historic moment for the young driver and his team.</p>",
      author: admin._id,
      images: [loadImageData(43)],
      category: "DTM",
    });

    articles.push({
      _id: new mongoose.Types.ObjectId(),
      title:
        "DTM Expands Global Reach with New Races in Asia and North America",
      content:
        "<p>The DTM is set to expand its global footprint with the addition of new races in Asia and North America. The series is in talks with several potential venues and aims to create a more diverse and geographically balanced calendar.</p><p>This expansion aligns with the DTM's ambition to become a truly global touring car series. By bringing the series to new markets, the DTM aims to attract a wider audience, increase its commercial appeal, and establish itself as a premier motorsport championship worldwide.</p>",
      author: admin._id,
      images: [loadImageData(45)],
      category: "DTM",
    });

    await ArticleModel.insertMany(articles);
  } catch (error) {
    console.error("Error seeding articles:", error);
    throw error;
  }
}

async function seedData() {
  try {
    // Seed Normal Users (with motorsport-themed usernames)
    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId(),
        username: motorsportIcons[i],
        email: faker.internet.email(),
        password: hashedPassword,
        role: "user",
        profileImage: null,
      });
    }
    await UserModel.insertMany(users);

    // Seed Articles
    await seedArticles();

    // Seed Shop Items (with one image each)
    const shopItems = [];
    for (let i = 49; i <= 53; i++) {
      shopItems.push({
        name: `${faker.random.arrayElement(
          teamNames
        )} ${faker.random.arrayElement(shopItemTypes)}`,
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        images: [loadImageData(i)], // Only one image
        stock: faker.datatype.number({ min: 10, max: 100 }),
      });
      await ShopItemModel.insertMany(shopItems);

      // Seed ONE Order
      await OrderModel.create({
        _id: new mongoose.Types.ObjectId(),
        user: users[0]._id, // Assuming you have at least one user seeded
        items: [{ shopItem: shopItems[0]._id, quantity: 1 }],
        totalAmount: shopItems[0].price,
        status: "pending", // Or another status as needed
      });
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedData();
