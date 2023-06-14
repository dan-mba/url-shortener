/* eslint prefer-arrow-callback: 0, func-names: 0, object-shorthand: 0,
   vars-on-top: 0, no-var: 0, prefer-template: 0, arrow-parens: 0 */

function ready() {
  document.getElementById("shortErr").style.display = "none";
  document.getElementById("shortUrl").style.display = "none";

  document.addEventListener("submit", e => {
    e.preventDefault();

    const form = e.target;

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          document.getElementById("shortErr").style.display = "none";

          const url = `${window.location.origin}/api/shorturl/${data.new_url}`;
          const urlTag = document.getElementById("shortUrl");
          urlTag.textContent = url;
          urlTag.setAttribute("href", url);
          urlTag.style.display = "inline";
        } else {
          document.getElementById("shortErr").style.display = "inline";
          document.getElementById("shortUrl").style.display = "none";
        }
      })
      .catch(err => console.error(err));
  });
}

if (document.readyState !== "loading") {
  ready();
} else {
  document.addEventListener("DOMContentLoaded", ready);
}
