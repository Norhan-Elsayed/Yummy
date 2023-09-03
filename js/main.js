let searchContainer = document.getElementById("searchContainer");
let mealsContainer = document.getElementById("mealsContainer");
let yummyContainer = document.getElementById("yummyContainer");
let submitBtn = document.getElementById("submitBtn");
let searchLink = document.getElementById("searchLink");
//  ******************* open sideBar **********************  //
function openSideNav() {
  $(".side-nav-menu").animate(
    {
      left: 0,
    },
    500
  );

  $(".open-close-side").removeClass("fa-align-justify");
  $(".open-close-side").addClass("fa-x"); //icon x

  //  **************************  animate links    ************************** //
  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 80
      );
  }
}
//  ******************* for close sideBar **********************  //
function closeSideNav() {
  let navWidth = $(".side-nav-menu .nav-tab").outerWidth();
  $(".side-nav-menu").animate(
    {
      left: -navWidth,
    },
    500
  );

  $(".open-close-side").addClass("fa-align-justify");
  $(".open-close-side").removeClass("fa-x");

  $(".links li").animate(
    {
      top: 300,
    },
    600
  );
}

closeSideNav();
$(".side-nav-menu i.open-close-side").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

// *************************loading screen spinner ************************** //
$(window).on("load", function () {
  $("#spinner").fadeOut(500, function () {
    $("body").css("overflow", "auto");
  });
});
// *************************fetch API**************************** //
async function getYummy() {
  let yummyResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  )
  let yummyData = await yummyResponse.json();
  displayYummy(yummyData.meals);
}
getYummy();

function displayYummy(yummyArr) {
  let mealsHTML = "";
  for (let i = 0; i < yummyArr.length; i++) {
    mealsHTML += `
    <div class="col-md-3">
    <div onclick="getMailsInformation('${yummyArr[i].idMeal}')" class="meal overflow-hidden cursor-pointer position-relative  rounded-2 ">
        <img class="w-100" src="${yummyArr[i].strMealThumb}">
        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${yummyArr[i].strMeal}</h3>
        </div>
    </div>
</div>
      `;
  }
  yummyContainer.innerHTML = mealsHTML;
}

// ******************** START SEARCH LINK ********************** //
$("#searchLink").click(() => {});

const yummyMealsLinks = document.querySelectorAll(".links ul li");
for (let i = 0; i < yummyMealsLinks.length; i++) {
  $(yummyMealsLinks[0]).click(() => {
    closeSideNav();
    // searchContainer.style.display = "block";
    $(searchContainer).show();
  });
}

// ************************** SEARCH BY NAME **************************//
 searchLink.addEventListener('input', function () {

  getYummy(searchByName.value)
 })

async function searchByName(term) {
  closeSideNav();
  yummyContainer.innerHTML = "";
  $("#spinner").fadeIn(400);

  let responseByName = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  )
  responseByName = await responseByName.json();
  console.log(responseByName);
  //******* */ (?) operator to check if the left side is true && array not empty ***** //
  responseByName.meals ? displayYummy(responseByName.meals) : displayYummy([]);
  $("#spinner").fadeOut(400);
}

// *************************** SEARCH BY First LETTER ************************** //

// (letter)=======> letter for search
async function searchByLetter(letter) {
  closeSideNav();
  yummyContainer.innerHTML = "";
  $("#spinner").fadeIn(300);
  // if letter empty set (a)
  letter == "" ? letter = "a" : "";
  let responseByLetter = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  responseByLetter = await responseByLetter.json();

  responseByLetter.meals
    ? displayYummy(responseByLetter.meals)
    : displayYummy([])
  $("#spinner").fadeOut(300);
}

// ********************** SHOW SEARCH *********************//
function showSearchInputs() {
  $("#searchContainer").show(100);
  searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input  onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;
  yummyContainer.innerHTML = "";
}
// ********************************* CATEGORY ********************************//
// *******************************GET CATEGORY *****************************//
async function getCategories() {
  yummyContainer.innerHTML = "";
  $("#spinner").fadeIn(300);
  searchContainer.innerHTML = "";

  let responseCategories = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  responseCategories = await responseCategories.json();

  displayCategories(responseCategories.categories);
  $("#spinner").fadeOut(300);
}
// ******************* GET CATEGORY MEALS ********************* //
 async function getCategoryMeals(category){
  yummyContainer.innerHTML = ""
  $("#spinner").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  response = await response.json()


  displayYummy(response.meals.slice(0, 20))
  $("#spinner").fadeOut(300)
 }
// *******************************DISPLAY CATEGORY *****************************//
// ****************** cat=======>abbreviation for (category) *******************//
function displayCategories(cat) {
  let categoryHTML = "";

  for (let i = 0; i < cat.length; i++) {
    categoryHTML += `
      <div class="col-md-3">
              <div onclick="getCategoryMeals('${
                cat[i].strCategory
              }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${cat[i].strCategoryThumb}">
                  <div class="meal-layer position-absolute text-center text-black p-2">
                      <h3>${cat[i].strCategory}</h3>
                      <p>${cat[i].strCategoryDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
                  </div>
              </div>
      </div>
      `;
  }
  yummyContainer.innerHTML = categoryHTML;
}
// ********************************* AREA ********************************//
// ***************************GET AREA *****************************//
async function getArea() {
  yummyContainer.innerHTML = "";
  $("#spinner").fadeIn(300);
  searchContainer.innerHTML = "";
  let responseArea = await fetch(
    `http://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  responseArea = await responseArea.json()
  displayArea(responseArea.meals);
  $("#spinner").fadeOut(300);
}
// *****************GET AREA MEALS******************** //
async function getAreaMeals(area) {
  yummyContainer.innerHTML = ""
  $("#spinner").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  response = await response.json()


  displayYummy(response.meals.slice(0, 20))
  $("#spinner").fadeOut(300)

}
// ***************************DISPLAY AREA *****************************//
function displayArea(arr) {
  let areaHTML = "";

  for (let i = 0; i < arr.length; i++) {
    areaHTML += `
      <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                  <i class="fa-solid fa-house-laptop fa-4x"></i>
                  <h3>${arr[i].strArea}</h3>
                </div>
        </div>
      `;
  }
  yummyContainer.innerHTML = areaHTML;
}

// ***************************GET Ingredients *****************************//
async function getIngredients() {
  yummyContainer.innerHTML = ""
  $("#spinner").fadeIn(300);
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  )
  response = await response.json()
  displayIngredients(response.meals.slice(0, 20));
  $("#spinner").fadeOut(300);
}



// ***************************DISPLAY Ingredients *****************************//
function displayIngredients(arr) {
  let ingredientsHTML = "";
  for (let i = 0; i < arr.length; i++) {
    ingredientsHTML += `
    <div class="col-md-3">
    <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${arr[i].strIngredient}</h3>
            <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
    </div>
</div>
           
    `;
  }
  yummyContainer.innerHTML = ingredientsHTML;
}

// *******************GET GRADIENT MEALS ********************** //

// async function getIngredientsMeals(ingredients) {
//   yummyContainer.innerHTML = ""
//   $("#spinner").fadeIn(300)

//   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
//   response = await response.json()
//   displayYummy(response.meals.slice(0, 20))
//   $("#spinner").fadeOut(300)

//  }
 async function getIngredientsMeals(nour){
  yummyContainer.innerHTML = ""
  $("#spinner").fadeIn(300)
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${nour}`)
  response = await response.json()
  displayYummy(response.meals.slice(0, 20))
  $("#spinner").fadeOut(300)
  console.log(response.meals)
 }

// ********************* getMailsInformation ******************* //
async function getMailsInformation(mealID) {
  closeSideNav()
  yummyContainer.innerHTML = ""
  $("#spinner").fadeIn(300)

  searchContainer.innerHTML = "";
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();

  displayMealInformation(respone.meals[0])
  $("#spinner").fadeOut(300)

}
// ****************** DISPLAY MEALS INFORMATION ******************* //
function displayMealInformation(meal) {
    
  searchContainer.innerHTML = "";


  let ingredients = ``

  for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
          ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
      }
  }
  // ?. ======> used to check if the strTags property is undefined. If it is, the tags variable is set to an empty array.
  let tags = meal.strTags?.split(",")

  if (!tags) tags = []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
      tagsStr += `
      <p class="alert alert-danger m-2 p-1">${tags[i]}</p>`
  }

  let details = `
  <div class="col-md-4">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}">
                  <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsStr}
              </ul>

              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`

  yummyContainer.innerHTML = details;
}


// ********************************* CONTACT US ********************************//

function showContact() {
  $("#searchContainer").hide(300);
    yummyContainer.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordValid" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordValid" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")
    
    document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailInputTouched) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordValid").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordValid").classList.replace("d-none", "d-block")

      }
  }
  if (repasswordInputTouched) {
      if (repasswordValidation()) {
          document.getElementById("repasswordValid").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("repasswordValid").classList.replace("d-none", "d-block")

      }
  }


  if (nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      repasswordValidation()) {
      submitBtn.removeAttribute("disabled")
  } else {
      submitBtn.setAttribute("disabled", true)
  }
}
  // **********************************VALIDATIONS*********************************** //
function nameValidation() {
  return (/^[A-Z][a-z]+$/.test(document.getElementById("nameInput").value))
}
  
function emailValidation() { 
  // ****************************example123@gmail.com*************************** //
  return (/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    //  *************************any egypt phone 11 numbers********************************
  return (/^(012|010|011)[0-9]{8}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^[0-9]{1,3}$|^[1-9]\d{2}$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  // *********************** like Nour@1234 *********************** //
  return (/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}