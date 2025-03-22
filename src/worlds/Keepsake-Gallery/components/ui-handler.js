// UI handler
document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            document.getElementById("upload-ui").style.display = "none";
        });
    }
});