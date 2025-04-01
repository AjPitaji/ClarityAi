const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");
const chatContainer = document.querySelector(".chat-container");
let userText = null;
const commonPrompt = `
You are a Mermaid diagram generator. The user will provide a project idea, 
and you will generate a simple, correct Mermaid diagram inside a <div class="mermaid"> container. 

Ensure:
- Valid Mermaid syntax (no errors).
- Consistent node shapes ([] for rectangles, {} for decisions, () for round nodes).
- No extra spaces or syntax mistakes.
- Keep it simple (avoid unnecessary styles or complex structures).
- Use 'graph TD;' for top-down or 'graph LR;' for left-right flow.
- Only return the Mermaid div, like this example:

<div class='mermaid'>graph TD; A-->B; A-->C; B-->D; C-->D;</div>

If the user does not provide a project idea, respond with:

"This is not a project. Please provide a project idea."
`;
const messages = [{ role: "user", parts: [{ text: commonPrompt }] }];

function cleanText(input) {
  // Remove ```html or similar code block indicators if present
  const cleaned = input.replace(/```html|```/g, "").trim();

  // Optional: Additional formatting cleanup (e.g., multiple spaces, newlines)
  return cleaned.replace(/\s+/g, " ").replace(/(?<=\w)\n/g, " ");
}

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (userPrompt, incomingChatDiv) => {
  const API_URL = apiKey;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_URL}`;

  // Add user prompt to messages array
  messages.push({ role: "user", parts: [{ text: userPrompt }] });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contents: messages }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const reply = data.candidates[0].content.parts[0].text;

  // Store model response in messages array
  messages.push({ role: "model", parts: [{ text: reply }] });

  const cleanedReply = cleanText(reply);
  console.log(cleanedReply);
  const divElement = document.createElement("div");
  divElement.innerHTML = cleanedReply;

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(divElement);

  let mermaidDiv = document.querySelector(".mermaid");
  mermaidDiv.innerHTML = mermaidDiv.innerHTML.replace(/^"(.*)"$/, "$1"); // Remove extra quotes
  mermaid.init();
};

const showTypingAnimation = (userPrompt) => {
  const html = `<div class="chat-content">
<div class="chat-details">
<img src="images/chatbot.png" alt="chatbot-img">
<div class="typing-animation">
<div class="typing-dot" style="--delay: 0.2s"></div>
<div class="typing-dot" style="--delay: 0.3s"></div>
<div class="typing-dot" style="--delay: 0.4s"></div>
</div>
</div>
<span class="material-symbols-rounded">content_copy</span>
</div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(userPrompt, incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
  const html = `<div class="chat-content">
<div class="chat-details">
<img src="images/user.png" alt="user-img" />
<p>${userText}</p>
</div>
</div>`;
  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = "";
  setTimeout(showTypingAnimation(userText), 500);
};

sendButton.addEventListener("click", handleOutgoingChat);
