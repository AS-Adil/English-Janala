// 1) ---------------Getting the lessons form API-----------
const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
};

loadLessons();

// 2) -------------Creating buttons for every Lessons from API----------
const displayLesson = (lessons) => {
  // getting the lesson container
  const lessonContainer = document.getElementById("lessons-container");
  lessons.forEach((lesson) => {
    const btnDiv = document.createElement("div");

    btnDiv.innerHTML = `        
                        <button id="lesson-btn-${lesson.level_no}" onclick="loadIfo(${lesson.level_no})"  class="btn btn-outline btn-primary lesson-btn">
                  <i class="fa-solid fa-book-open"></i>
                  Lesson -${lesson.level_no}
                </button>

        `;
    lessonContainer.appendChild(btnDiv);
  });
};

// --Active button -----
const removeActive = () => {
  const allBtn = document.getElementsByClassName("lesson-btn"); // this will return a Html collection, so we can't directly use forEach or simillar method as it don't return nodelist (if we want to use forEch or simillar method then, we can use "queryselectorAll")
  for (const btn of allBtn) {
    btn.classList.remove("active");
  }
};

// 3)------------------- Getting all the words for every lesson ------------------
const loadIfo = (id) => {
  removeActive();
  const clickedBtn = document.getElementById(`lesson-btn-${id}`);
  clickedBtn.classList.add("active");

  spinner(true);

  // ------loadng all word based on lessons id --
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    // .then((data) => displayInfo(data.data));
    .then((data) => {
      displayInfo(data.data);
    });
};

// 7) --------------functionalites for spinner--------------------
const spinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
};




// 4)---------------- Creating Card for every words------------------
const displayInfo = (words) => {
  // console.log(words);
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  // validaton for empty lessons
  if (words.length === 0) {
    wordContainer.innerHTML = `
        <div class="col-span-full text-center space-y-4 mt-2">
            <img class="mx-auto" src="assets/alert-error.png" alt="">
            <p class="text-gray-500 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-4xl font-semibold ">
            নেক্সট Lesson এ যান
            </h2>
        </div>   `;
    spinner(false);
    return;
  }

  words.forEach((word) => {
    // console.log(word.id);
    const div = document.createElement("div");
    div.className = `
           bg-white text-center rounded-xl shadow-md
           flex flex-col items-center justify-center gap-4 py-8
           transition-transform duration-300 ease-in-out
           hover:scale-102 hover:shadow-xl  `;

    div.innerHTML = `
          
          <h3 class="text-2xl font-semibold">${
            word.word ? word.word : "Not found😪"
          }</h3>

            <p class="font-semibold"> Meaning / Pronounciation </p>

            <p class="font-semibold font-bangla">
                "${word.meaning ? word.meaning : "Not found😪"} / ${
      word.pronunciation ? word.pronunciation : "Not found😪"
    }"   
            </p>

            <div class="flex justify-between w-full px-6">
               <button onclick="wordDetails(${
                 word.id
               })" class="bg-[#1A91FF10] py-2 px-3  rounded-lg hover:bg-[#1A91FF80] cursor-pointer"><i class="fa-solid fa-circle-info"></i>
               </button>

               <button class="bg-[#1A91FF10] py-2 px-3  rounded-lg hover:bg-[#1A91FF80] cursor-pointer"><i class="fa-solid fa-volume-high"></i>
               </button>
            </div>

          `;

    wordContainer.appendChild(div);
  });

  spinner(false);
};

//5) ---------------Getting details of every word-----------------------
const wordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  const resopose = await fetch(url);
  const details = await resopose.json();
  showModals(details.data);
};

//6) -----------------------functionalities for Modal----------------------
const showModals = (word) => {
  const createElements = (arr) => {
    const htmls = arr.map(
      (el) =>
        `<button class="modal-btn bg-[#EDF7FF] px-6 py-2 rounded-md"><span>${el}</span></button> `
    );
    return htmls.join(" ");
  };

  const modal = document.getElementById("modal");
  modal.innerHTML = `
 
  
      <div class="space-y-1">
        <h2 class="text-2xl font-bold">
          ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :  ${
    word.pronunciation
  } )
        </h2>
      </div>

      <div class="space-y-1">
        <h2 class="font-bold">Meaning</h2>
        <p>${word.meaning}</p>
      </div>

      <div class="space-y-1">
        <h2 class="font-bold">Example</h2>
        <p>${word.sentence}</p>
      </div>

      <div class="space-y-1">
        <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
        <div>
         ${createElements(word.synonyms)}
        </div>
      
        
      </div>

 `;

  document.getElementById("word_modal").showModal();
};

// 8)----------------------- functionalaties fo Search--------------------------
document.getElementById("search-btn").addEventListener("click", () => {
  const givenInput = document.getElementById("input");
  const inputsValue = givenInput.value.trim().toLowerCase();
  console.log(inputsValue);
  removeActive();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWord = data.data;

      const filteredWord = allWord.filter((word) =>
        word.word.trim().toLowerCase().includes(inputsValue)
      );

      displayInfo(filteredWord);
    });
});
