document.addEventListener("DOMContentLoaded", () => {
    // Watch the entire body for any new subtree nodes
    const observer = new MutationObserver((mutations, obs) => {
        const btn = document.getElementById("chatbase-bubble-button");
        if (!btn) return; // not there yet
        const wrapper = btn.firstElementChild;
        if (!wrapper) return; // double-check

        // 1) Change the text
        wrapper.innerHTML = "Chat Us";
        // 2) Add your classes
        btn.classList.add("chat-btn");
        wrapper.classList.add("chat-btn-wrapper");
        // 3) stop observing
        obs.disconnect();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
