import Router from "/build/semantq/router.js";

async function pageJS() {
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

    await pageJS();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
