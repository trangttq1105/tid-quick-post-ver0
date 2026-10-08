// ===============================
// TID Quick Post Template
// ===============================

const SHEET_ID = "1I3IUFEz_kqvsjMsUW4feiGoODnfjMyWnx5Kcul9XrQk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let sentences = [];

// ===============================
// Load Google Sheet
// ===============================

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {

    const json = JSON.parse(
      text.substring(47).slice(0, -2)
    );

    sentences = json.table.rows
      .map(row => row.c[0]?.v)
      .filter(Boolean);

    console.log(
      "Loaded:",
      sentences.length,
      "sentences"
    );

  })
  .catch(err => {

    console.error(err);

    alert("Unable to load Google Sheet.");

  });


// ===============================
// Random helper
// ===============================

function getRandomItems(arr, count) {

  return [...arr]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

}


// ===============================
// Generate
// ===============================

document
  .getElementById("generateBtn")
  .addEventListener("click", () => {

    const customText = document
      .getElementById("customText")
      .value
      .trim();

    const mainHashtag = document
      .getElementById("mainHashtag")
      .value
      .trim();


    // ===============================
    // Validate custom text
    // ===============================

    if (!customText) {

      alert("Unique text is required.");

      return;

    }


    // ===============================
    // Validate hashtag
    // ===============================

    if (!mainHashtag) {

      alert("Main hashtag is required.");

      return;

    }


    if (!mainHashtag.startsWith("#")) {

      alert(
        'Main hashtag must start with "#".\n\nExample:\n#TheInvisibleDragonQ1'
      );

      return;

    }


    // ===============================
    // Check sentences
    // ===============================

    if (sentences.length === 0) {

      alert("Sentences are still loading.");

      return;

    }


    // ===============================
    // Get sub hashtags
    // ===============================

    const subHashtags = Array.from(
      document.querySelectorAll(
        '.checkbox-group input[type="checkbox"]:checked'
      )
    )
      .map(cb => cb.value)
      .join(" ");


    // ===============================
    // Random 10 posts
    // ===============================

    const randomPosts = getRandomItems(
      sentences,
      10
    );


    const result =
      document.getElementById("result");

    result.innerHTML = "";


    // ===============================
    // Create post cards
    // ===============================

    randomPosts.forEach((sentence, index) => {

      let postText =
`${sentence} ${customText}

${mainHashtag}`;


      if (subHashtags) {

        postText += `\n${subHashtags}`;

      }


      // X post URL

      const twitterURL =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(postText);


      // Create card

      const card =
        document.createElement("div");

      card.className = "post";


      card.innerHTML = `
        <p>${postText.replace(/\n/g, "<br>")}</p>

        <a
          href="${twitterURL}"
          target="_blank"
          rel="noopener"
        >
          <button type="button">
            Post
          </button>
        </a>
      `;


      // ===============================
      // Track Post to X
      // ===============================

      const postLink =
        card.querySelector("a");


      postLink.addEventListener("click", () => {

        if (typeof gtag === "function") {

          gtag("event", "post_to_x", {

            tool_name: "TID Quick Post Template",

            action: "post_to_x",

            post_number: index + 1

          });

        }

      });


      result.appendChild(card);

    });


    // ===============================
    // Track Generate
    // ===============================

    if (typeof gtag === "function") {

      gtag("event", "generate_posts", {

        tool_name: "TID Quick Post Template",

        action: "generate",

        post_count: randomPosts.length

      });

    }

  });
