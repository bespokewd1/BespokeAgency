document.addEventListener("DOMContentLoaded", () => {
    const customize = (btn) => {
        const child = btn.firstElementChild;
        if (!child) return;

        let alreadyCustomized =
            child.innerHTML === "Chat Us" &&
            btn.classList.contains("chat-btn") &&
            child.classList.contains("chat-btn-wrapper");

        if (alreadyCustomized) {
            return; // Already looks like we want it, do nothing
        }

        // Apply customizations ONLY if needed
        child.innerHTML = "Chat Us";
        btn.classList.add("chat-btn");
        child.classList.add("chat-btn-wrapper");
    };

    // 1) Watch the whole body just long enough to catch the first insertion
    const bodyObserver = new MutationObserver((_, obs) => {
        const btn = document.getElementById("chatbase-bubble-button");
        if (!btn) return; // Not found yet

        // Found it! Apply customization once...
        customize(btn);

        // ...stop watching the body...
        obs.disconnect();

        // ...and now watch *just* that button for child/subtree changes
        // This observer will catch when Chatbase reverts the button's content
        const btnObserver = new MutationObserver(() => {
            // Re-run customize whenever Chatbase changes the button internals
            customize(btn);
        });
        btnObserver.observe(btn, { childList: true, subtree: true });
    });

    // Start observing the body
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
