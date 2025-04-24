document.addEventListener("DOMContentLoaded", () => {
    const customize = (btn) => {
        const child = btn.firstElementChild;
        if (!child) return;
        child.innerHTML = "Chat Us";
        btn.classList.add("chat-btn");
        child.classList.add("chat-btn-wrapper");
    };

    // 1) Watch the whole body just long enough to catch the first insertion
    const bodyObserver = new MutationObserver((_, obs) => {
        const btn = document.getElementById("chatbase-bubble-button");
        if (!btn) return;

        customize(btn);

        // Stop watching the body...
        obs.disconnect();

        // ...and now watch *just* that button for child/subtree changes
        //  making sure that it will always apply whenever it revert back to default
        const btnObserver = new MutationObserver(() => customize(btn));
        btnObserver.observe(btn, { childList: true, subtree: true });
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
