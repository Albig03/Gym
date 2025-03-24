document.addEventListener("DOMContentLoaded", function () {
    const searchFoodBtn = document.getElementById("searchFoodBtn");
    const foodSearchInput = document.getElementById("foodSearchInput");
    const addedFoodsList = document.getElementById("addedFoodsList");
    const totalCaloriesElem = document.getElementById("totalCalories");
    const addManualFoodBtn = document.getElementById("addManualFood");
    const backToDashboardBtn = document.getElementById("backToDashboardBtn");

    let totalCalories = 0;
    let foodItems = [];

    // Function to update the total calorie count
    function updateTotalCalories() {
        totalCaloriesElem.textContent = totalCalories;
    }

    // Function to render food items
    function renderFoodItems() {
        addedFoodsList.innerHTML = "";
        foodItems.forEach((food, index) => {
            const li = document.createElement("li");
            li.classList.add("food-item");

            li.innerHTML = `
                <span>${food.name}</span>
                <span>${food.calories} cal</span>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            addedFoodsList.appendChild(li);
        });
        updateTotalCalories();
    }

    // Function to search food
    async function searchFood() {
        const query = foodSearchInput.value.trim();

        if (!query) return;

        // Call an external API for food search (e.g., Open Food Facts)
        const res = await fetch(`https://api.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=true`);
        const data = await res.json();

        const results = data.products || [];
        const searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = "";

        results.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("food-item");

            productDiv.innerHTML = `
                <span>${product.product_name || "Unknown"}</span>
                <span>${product.nutriments?.energy || "N/A"} cal</span>
                <button class="add-btn" data-product='${JSON.stringify(product)}'>Add</button>
            `;
            searchResults.appendChild(productDiv);
        });
    }

    // Function to add food manually
    function addManualFood() {
        const name = document.getElementById("foodName").value.trim();
        const calories = parseFloat(document.getElementById("manualCalories").value);
        const protein = parseFloat(document.getElementById("manualProtein").value);
        const carbs = parseFloat(document.getElementById("manualCarbs").value);
        const fats = parseFloat(document.getElementById("manualFats").value);

        if (!name || isNaN(calories)) {
            alert("Please provide valid input.");
            return;
        }

        const food = {
            name,
            calories,
            protein,
            carbs,
            fats
        };

        foodItems.push(food);
        totalCalories += calories;
        renderFoodItems();
    }

    // Function to remove food
    function removeFood(index) {
        totalCalories -= foodItems[index].calories;
        foodItems.splice(index, 1);
        renderFoodItems();
    }

    // Event listeners
    searchFoodBtn.addEventListener("click", searchFood);

    addManualFoodBtn.addEventListener("click", addManualFood);

    addedFoodsList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            removeFood(index);
        }
    });

    // Button to go back to the dashboard
    backToDashboardBtn.addEventListener("click", function () {
        window.location.href = "dashboard.html"; // Update this based on your actual dashboard URL
    });

    // Render food items on initial load
    renderFoodItems();
});
