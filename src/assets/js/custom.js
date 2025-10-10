var typing = new Typed(".cs-changing-text", {
    strings: ["Entrepreneurs", "Plumbers", "Contractors", "Small Businesses", "Startups"],
    typeSpeed: 100,
    backSpeed: 40,
    loop: true,
    backDelay: 2000,
});

document.getElementById('verify-button').addEventListener('click', function (event) {
    const domainInput = document.getElementById('cs-domain-check').value.trim();
    if (domainInput) {
        // Update the URL with the entered domain
        const baseLink = "https://namecheap.pxf.io/c/5804036/386170/5618?u=https%3A%2F%2Fwww.namecheap.com%2Fdomains%2Fregistration%2Fresults.aspx%3Fdomain%3D";
        this.href = baseLink + encodeURIComponent(domainInput);
    } else {
        // Prevent navigation if no domain is entered
        event.preventDefault();
        alert('Please enter a domain to verify.');
    }
});



