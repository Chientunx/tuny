function setActive(element) {
    // Remove "active" from all links
    document.querySelectorAll(".nav-bar a").forEach(link => {
        link.classList.remove("active");
    });

    // Add "active" to the clicked link
    element.classList.add("active");
}


// CONTACT IMPORMATION BOX
document.getElementById("contact-btn").addEventListener("click", function() {
    document.getElementById("contact-popup-overlay").classList.add("show");
});

document.getElementById("close-contact-popup").addEventListener("click", function() {
    document.getElementById("contact-popup-overlay").classList.remove("show");
});

document.getElementById("contact-popup-overlay").addEventListener("click", function(event) {
    if (event.target === this) {
        this.classList.remove("show");
    }
});

// 


const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Hide all contents
        contents.forEach(content => content.classList.remove("active"));

        // Show the selected content
        const target = tab.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");
    });
});



// IMAGE POPUP
document.addEventListener("DOMContentLoaded", function () {
    const arrowButtons = document.querySelectorAll(".grid-item .arrow-btn");
    const popups = document.querySelectorAll(".image-popup-overlay");
    const closeButtons = document.querySelectorAll(".close-btn");
    // 🟢 OPEN POPUP
    arrowButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            let popup = document.getElementById(`popup-${index + 1}`);
            if (popup) {
                popup.classList.add("active");
            }
        });
    });
    // 🟢 CLOSE POPUP (via close button)
    closeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            this.closest(".image-popup-overlay").classList.remove("active");
        });
    });
    // 🟢 CLOSE POPUP (by clicking outside)
    popups.forEach((popup) => {
        popup.addEventListener("click", function (event) {
            if (event.target === this) {
                this.classList.remove("active");
            }
        });
    });
});



// TAB 3

// Graphic Design Popup Logic
document.querySelectorAll(".graphic-arrow-btn").forEach(button => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup");
        document.getElementById(popupId).style.display = "flex";
    });
});

document.querySelectorAll(".graphic-close-btn").forEach(button => {
    button.addEventListener("click", function () {
        this.closest(".graphic-popup-overlay").style.display = "none";
    });
});

document.querySelectorAll(".graphic-popup-overlay").forEach(overlay => {
    overlay.addEventListener("click", function (event) {
        if (event.target === this) {
            this.style.display = "none";
        }
    });
});




// LIKE TAB POPUP HANDLER
// document.querySelectorAll(".like-arrow-btn").forEach(button => {
//     button.addEventListener("click", function () {
//         const popupId = this.getAttribute("data-popup");
//         document.getElementById(popupId).classList.add("active");
//     });
// });

// document.querySelectorAll(".like-close-btn").forEach(button => {
//     button.addEventListener("click", function () {
//         const popup = this.closest(".like-popup-overlay");
//         const video = popup.querySelector("video");
//         video.pause();
//         video.currentTime = 0;
//         popup.classList.remove("active");
//     });
// });
