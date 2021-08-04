const input = document.getElementById("input") as HTMLInputElement;
const button = document.getElementById("button")!;
const userId = localStorage.getItem("userId");
localStorage.removeItem("userId");

if (userId === null) {
  location.href = "/.netlify/functions/login";
}

button.addEventListener("click", () => {
  const { value } = input;
  const iframe = document.createElement("iframe");
  iframe.src = `http://localhost:${value}`;
  iframe.setAttribute("style", "display: none");
  document.body.appendChild(iframe);

  window.addEventListener("message", (event) => {
    const { contentWindow } = iframe;

    if (!contentWindow || event.source !== contentWindow) {
      return;
    }

    contentWindow.postMessage(userId, "*");
  });
});
