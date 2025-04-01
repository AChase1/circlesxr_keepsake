// UI handler
document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            document.getElementById("upload-ui").style.display = "none";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const closeBtn2D = document.getElementById("close-btn-2D");
    if (closeBtn2D) {
        closeBtn2D.addEventListener("click", function () {
            document.getElementById("upload-2D-ui").style.display = "none";
        });
    }
});

// comment box