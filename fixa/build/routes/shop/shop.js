import Router from "/core_modules/router/router.js";
import Cartique from "cartique";

async function layoutJS() {
  console.log("Layout script started");

  function layoutInit() {
    const layoutBlocks = {
      head: `<head><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" /><link rel="stylesheet" href="/cartique-css.css" /><link rel="stylesheet" href="/main.css" /></head>`,
      body: ``,
      footer: ``,
    };

    if (layoutBlocks) {
      // Step 1: Update <head> if header exists
      if (layoutBlocks.head) {
        updateHead(layoutBlocks.head);
      }

      // Step 2: Update <body> if body exists
      if (layoutBlocks.body) {
        updateBody(layoutBlocks.body);
      }

      // Step 3: Append <footer> to <body> if footer exists
      if (layoutBlocks.footer) {
        appendFooter(layoutBlocks.footer);
      }

      // Utility function to load scripts and ensure they execute
      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      function updateHead(headerHTML) {
        const head = document.head;

        // Create a template for the new header content
        const template = document.createElement("template");
        template.innerHTML = headerHTML;

        // Preserve only Vite-injected scripts and modulepreload links
        const preservedElements = [];
        head
          .querySelectorAll("script, link[rel='modulepreload']")
          .forEach((el) => {
            if (
              (el.tagName === "SCRIPT" && el.type === "module") ||
              (el.tagName === "LINK" && el.rel === "modulepreload") ||
              el.src?.includes("/assets/router-") ||
              el.href?.includes("/assets/modulepreload-polyfill")
            ) {
              preservedElements.push(el.outerHTML);
            }
          });

        // Remove all existing head content
        while (head.firstChild) {
          head.removeChild(head.firstChild);
        }

        // Append new head content
        const newElements = template.content.cloneNode(true);
        head.appendChild(newElements);

        // Re-add preserved Vite scripts
        preservedElements.forEach((scriptHTML) => {
          const temp = document.createElement("template");
          temp.innerHTML = scriptHTML;
          head.appendChild(temp.content.firstChild);
        });

        console.log(
          "Updated head with layout content while preserving Vite scripts."
        );
      }

      function updateBody(bodyHTML) {
        const body = document.body;

        // Create a template for the body content
        const template = document.createElement("template");
        template.innerHTML = bodyHTML;

        // Replace the body content with the cloned template
        body.innerHTML = ""; // Clear existing content
        body.appendChild(template.content.cloneNode(true));
      }

      function appendFooter(footerHTML) {
        const body = document.body;

        // Create a template for the footer content
        const template = document.createElement("template");
        template.innerHTML = footerHTML;

        // Append the cloned template content to the body
        body.appendChild(template.content.cloneNode(true));
      }
    }
  }

  // initiate it
  layoutInit();
}

async function pageJS() {
  const products = [
    {
      id: 1,
      title: "Hibiscus Flower Powder",
      description:
        "Powerful Antioxidant & Heart Health Support. Boost your wellness naturally with our organic hibiscus flower powder, packed with vitamin C and antioxidants. Known for its blood pressure-balancing benefits, this superfood helps support cardiovascular health, improve digestion, and promote radiant skin. Perfect for detox teas, smoothies, and homemade skincare.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/ashwaganda.png",
      sale_price: 89.99,
    },
    {
      id: 2,
      title: "Soursop Leaves Powder (Graviola)",
      description:
        "Natural Immune Booster & Cancer-Fighting Properties. Our premium soursop leaves powder is a potent immune-modulator with anti-inflammatory and anticancer properties. Traditionally used to fight infections, reduce stress, and support cellular health, it's ideal for herbal teas, tonics, and wellness blends.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/soursop.png",
    },
    {
      id: 3,
      title: "Lion's Mane Mushroom Powder",
      description:
        "Brain Booster & Nerve Regeneration. Enhance focus, memory, and cognitive function with our 100% pure Lion's Mane powder. This neuroprotective superfood stimulates nerve growth factor (NGF), helping with anxiety relief, mental clarity, and nerve repair. Great for coffee, soups, and nootropics.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/lionsmane.png",
      sale_price: 89.99,
    },
    {
      id: 4,
      title: "Ashwagandha Powder (Withania Somnifera)",
      description:
        "Stress Relief & Adrenal Support. Our organic Ashwagandha powder is a natural adaptogen that helps reduce cortisol, boost energy, and improve sleep. Perfect for managing stress, enhancing stamina, and balancing hormones. Mix into warm milk, smoothies, or golden lattes.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/ashwaganda.png",
    },
    {
      id: 5,
      title: "Raw Sea Moss (Irish Moss Gel)",
      description:
        "Thyroid Support & Skin Rejuvenation. Unlock 92+ essential minerals with our wildcrafted raw sea moss, a thyroid-balancing, collagen-boosting superfood. Supports gut health, respiratory function, and radiant skin. Soak and blend into gels, smoothies, or face masks.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/rawseamoss.png",
    },
    {
      id: 6,
      title: "Shilajit Resin (Pure Himalayan)",
      description:
        "Ancient Energy & Testosterone Booster. Our authentic Shilajit jelly is rich in fulvic acid, enhancing stamina, muscle recovery, and male vitality. A natural anti-aging remedy that boosts ATP production, immunity, and mental performance. Take a rice-sized dose daily for best results.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/shijilat.png",
      sale_price: 89.99,
    },
    {
      id: 7,
      title: "Weight Gain Porridge Mix",
      description:
        "Healthy Muscle Builder & Calorie Booster. Struggling to gain weight naturally? Our nutrient-dense weight gain porridge is packed with plant proteins, healthy carbs, and essential vitamins for healthy mass gain. Ideal for athletes, underweight individuals, and post-illness recovery.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/weightgainporridge.png",
    },
    {
      id: 8,
      title: "Guava Leaves Powder",
      description:
        "Blood Sugar Balance & Digestive Aid. Our organic guava leaves powder helps regulate blood sugar, improve digestion, and fight infections. A traditional remedy for diabetes, diarrhea, and oral health. Brew as tea or add to juices.",
      price: 99.99,
      currency: "R",
      image: "/images/product_images/guavaleavespowder.png",
    },
  ];
  const features = {
    grid: true,
    pagination: false,
    columns: 3,
    rows: 6,
    theme: "#fff",
    sale: true,
    search: true,
    sorting: true,
    checkoutUrl: "https://www.google.com/",
    checkoutUrlMode: "_blank",
    sidebar: false,
    footer: false,
  };
  const productFilters = {
    color: [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Purple",
      "Orange",
      "Black",
      "White",
    ],
    size: ["S", "M", "L", "XL", "XXL", "XS"],
    brand: [
      "Adidas",
      "Nike",
      "Puma",
      "Reebok",
      "Converse",
      "Vans",
      "New Balance",
    ],
    category: [
      "Shoes",
      "T-Shirts",
      "Hoodies",
      "Pants",
      "Shorts",
      "Dresses",
      "Jackets",
    ],
    priceRange: ["Under $20", "$20-$50", "$50-$100", "$100-$200", "Over $200"],
    rating: ["1-2 stars", "2-3 stars", "3-4 stars", "4-5 stars"],
    material: ["Cotton", "Polyester", "Leather", "Synthetic", "Wool"],
    style: ["Casual", "Formal", "Sporty", "Vintage", "Streetwear"],
  };
  const shopUI = new Cartique(products, {
    ...features,
    sidebarFeatures: {
      priceFilter: true,
      colorFilter: true,
      sizeFilter: true,
      brandFilter: true,
      filters: productFilters,
    },
  });
  console.log(Router);
}

async function main() {
  try {
    await new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });

    console.log("DOM is ready");

    await layoutJS();

    await pageJS();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
