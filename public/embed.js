const CHAT_BUTTON_SIZE = 50,
  CHAT_BUTTON_RADIUS = 25,
  CHAT_BUTTON_BACKGROUND_COLOR = "black",
  SEND_BUTTON_BACKGROUND_COLOR = "black",
  SOURCES_SEPARATOR = "$*%^$",
  scriptTag = document.currentScript,
  CHAT_BUTTON_ICON =
    '\n  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="#FFFFFF"/>\n  </svg>\n',
  chatButton = document.createElement("div");

chatButton.setAttribute("id", "chatbase-bubble-button"),
  (chatButton.style.position = "fixed"),
  (chatButton.style.bottom = "20px"),
  (chatButton.style.right = "20px"),
  (chatButton.style.width = "50px"),
  (chatButton.style.height = "50px"),
  (chatButton.style.borderRadius = "25px"),
  (chatButton.style.backgroundColor = "black"),
  (chatButton.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)"),
  (chatButton.style.cursor = "pointer"),
  (chatButton.style.zIndex = 999999999),
  (chatButton.style.transition = "all .2s ease-in-out"),
  chatButton.addEventListener("mouseenter", (t) => {
    chatButton.style.transform = "scale(1.05)";
  }),
  chatButton.addEventListener("mouseleave", (t) => {
    chatButton.style.transform = "scale(1)";
  });

const chatButtonIcon = document.createElement("div");
(chatButtonIcon.style.display = "flex"),
  (chatButtonIcon.style.alignItems = "center"),
  (chatButtonIcon.style.justifyContent = "center"),
  (chatButtonIcon.style.width = "100%"),
  (chatButtonIcon.style.height = "100%"),
  (chatButtonIcon.style.zIndex = 999999999),
  (chatButtonIcon.innerHTML = CHAT_BUTTON_ICON),
  chatButton.appendChild(chatButtonIcon),
  document.body.appendChild(chatButton),
  chatButton.addEventListener("click", () => {
    "none" === chat.style.display
      ? (chat.style.display = "flex")
      : (chat.style.display = "none");
  });

const chat = document.createElement("div");

chat.setAttribute("id", "chatbase-bubble-window"),
  (chat.style.position = "fixed"),
  (chat.style.flexDirection = "column"),
  (chat.style.justifyContent = "space-between"),
  (chat.style.bottom = "80px"),
  (chat.style.right = "20px"),
  (chat.style.width = "85vw"),
  (chat.style.height = "70vh"),
  (chat.style.backgroundColor = "#fff"),
  (chat.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)"),
  (chat.style.display = "none"),
  (chat.style.border = "1px solid #D5D4D5"),
  (chat.style.borderRadius = "10px"),
  (chat.style.zIndex = 999999999),
  (chat.style.padding = "5px"),
  document.body.appendChild(chat),
  (chat.innerHTML = `<iframe\nsrc="http://localhost:3000/embed/bot/c847eee0-ac29-4f00-9f33-3e23a74d232b"\nwidth="100%"\nheight="100%"\nframeborder="0"\n></iframe>`);

const mediaQuery = window.matchMedia("(min-width: 550px)");

function handleChatWindowSizeChange(t) {
  t.matches && ((chat.style.height = "600px"), (chat.style.width = "400px"));
}

mediaQuery.addEventListener("change", handleChatWindowSizeChange),
  handleChatWindowSizeChange(mediaQuery);
