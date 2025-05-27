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
