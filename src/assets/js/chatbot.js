document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver((mutationsList, observer) => {
        const chatBtn = document.getElementById("chatbase-bubble-button");

        if (chatBtn) {
            const directChild = chatBtn.children[0];

            if (directChild) {
                // directChild.setAttribute("src", "/assets/images/bespokeog.png");
                directChild.innerHTML = "Chat us";
                chatBtn.classList.add("chat-btn");
                directChild.classList.add("chat-btn-wrapper");
                observer.disconnect(); // Stop observing once changes are made
            }
        }
    });

    const chatBtn = document.getElementById("chatbase-bubble-button");
    if (chatBtn) {
        observer.observe(chatBtn, { childList: true, subtree: true }); // Observe child elements and their descendants
    } else {
        console.log("chatbase-bubble-button element not found initially!"); // Optional log
    }
});
