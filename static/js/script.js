document.addEventListener("DOMContentLoaded", function () {
    console.log("WildlifeAI Core Engine Initialized...");

    // ==========================================================================
    // 1. MAGNETIC LIQUID NAV SLIDING BLOB ENGINE (iPhone State Style)
    // ==========================================================================
    function initNavbarBlob() {
        const navLinksContainer = document.querySelector(".nav-links");
        const navItems = document.querySelectorAll(".nav-links a");
        
        if (!navLinksContainer || navItems.length === 0) return;

        // Clean up old active blobs if any exist to prevent duplicate layout overlays
        let blob = navLinksContainer.querySelector(".nav-blob");
        if (!blob) {
            blob = document.createElement("div");
            blob.classList.add("nav-blob");
            navLinksContainer.appendChild(blob);
        }

        // Internal engine metrics tracked to calculate live fluid velocity vectors
        let currentLeft = 0;

        function positionBlob(activeLink, useMorphPhysics = true) {
            if (!activeLink) return;
            
            // Core Upgraded Logic: Calculate dynamic local bounds relative to the parent flex container frame
            const containerRect = navLinksContainer.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();

            const targetLeft = linkRect.left - containerRect.left;
            const targetTop = linkRect.top - containerRect.top;
            const targetWidth = linkRect.width;
            const targetHeight = linkRect.height;

            // Calculate distance traveled to dynamically calibrate stretch scale
            const distanceMoved = targetLeft - currentLeft;
            currentLeft = targetLeft;

            // Set spatial matching frame dimensions inside the navbar tracks
            blob.style.width = `${targetWidth}px`;
            blob.style.height = `${targetHeight}px`;

            // Elastic stretch mechanics simulation engine
            if (useMorphPhysics && Math.abs(distanceMoved) > 8) {
                // Calculate scale proportion up to a safe structural threshold cap (1.5x)
                const fluidStretchFactor = 1 + Math.min(Math.abs(distanceMoved) / 130, 0.5);
                
                // Align transformation baseline according to movement direction vectors
                blob.style.transformOrigin = distanceMoved > 0 ? "center left" : "center right";
                
                // Fire acceleration stretch transform layer immediately
                blob.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0) scaleX(${fluidStretchFactor})`;

                // Instantly snap back to target equilibrium shape once the animation midpoint clears
                setTimeout(() => {
                    blob.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0) scaleX(1)`;
                }, 180);
            } else {
                // Fallback static snap layout assignment
                blob.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0) scaleX(1)`;
            }

            blob.style.opacity = "1"; 
        }

        // --- AUTOMATIC ACTIVE PAGE DETECTION SYSTEM ---
        let currentActive = navItems[0]; // Fallback default to first item (Home)
        const currentPath = window.location.pathname;

        navItems.forEach(item => {
            const itemHref = item.getAttribute("href");
            
            // Match current location paths against template attributes cleanly
            if (currentPath === itemHref || (itemHref !== "/" && currentPath.includes(itemHref))) {
                currentActive = item;
            }
            
            // Hover tracking interaction triggers: Move capsule to cursor dynamically
            item.addEventListener("mouseenter", () => positionBlob(item, true));
        });

        // Initialize state: Lock capsule instantly onto the active page button on startup
        positionBlob(currentActive, false);

        // Snap back smoothly onto active home/predict element when mouse exits navbar boundary
        navLinksContainer.addEventListener("mouseleave", () => {
            positionBlob(currentActive, true);
        });

        // Dynamic recalculation fallback if screen size changes
        window.addEventListener("resize", () => positionBlob(currentActive, false));
    }

    // Run engine with a micro-timeout to ensure layout dimensions render accurately
    setTimeout(initNavbarBlob, 150);
    
    // Safety Fallback: Force recalculation when external Google Fonts finish rendering
    if (document.fonts) {
        document.fonts.ready.then(() => initNavbarBlob());
    }

    // ==========================================================================
    // 2. LIQUID GLASS VOLUMETRIC TAP RIPPLE FOR ALL BUTTONS
    // ==========================================================================
    const allInteractiveButtons = document.querySelectorAll(".btn, .back-btn, .btn-browse, button, input[type='submit']");

    allInteractiveButtons.forEach(button => {
        button.style.position = "relative";
        button.style.overflow = "hidden";

        button.addEventListener("click", function (e) {
            const oldRipple = this.querySelector(".glass-ripple");
            if (oldRipple) oldRipple.remove();

            const ripple = document.createElement("span");
            ripple.classList.add("glass-ripple");

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 650);
        });
    });

    // ==========================================================================
    // 3. FLUID DRAG-AND-DROP UI STATE MACHINE (Runs safely if elements exist)
    // ==========================================================================
    const imageInput = document.getElementById("imageInput");
    const previewImage = document.getElementById("previewImage");
    const uploadForm = document.getElementById("uploadForm");
    const loading = document.getElementById("loading");
    const dropArea = document.getElementById("dropArea");

    function handleFileSelected(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (previewImage) {
                previewImage.style.opacity = "0";
                previewImage.style.transform = "scale(0.92)";
                previewImage.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                void previewImage.offsetWidth;
                previewImage.style.opacity = "1";
                previewImage.style.transform = "scale(1)";
            }
            if (dropArea) {
                const innerElements = dropArea.querySelectorAll("h2, p, i, .btn-browse, i.fa-cloud-arrow-up, .cloud-icon");
                innerElements.forEach(el => {
                    el.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
                    el.style.opacity = "0";
                    el.style.transform = "translateY(-10px)";
                    setTimeout(() => el.style.display = "none", 300);
                });
                dropArea.style.transition = "all 0.5s cubic-bezier(0.25, 1, 0.2, 1)";
                dropArea.style.borderStyle = "solid";
                dropArea.style.borderColor = "rgba(255,255,255,0.15)";
                dropArea.style.padding = "16px";
            }
        };
        reader.readAsDataURL(file);
    }

    if (imageInput) {
        imageInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) handleFileSelected(file);
        });
    }

    if (dropArea) {
        dropArea.style.transition = "all 0.4s cubic-bezier(0.25, 1, 0.2, 1)";
        dropArea.addEventListener("dragover", function (e) {
            e.preventDefault();
            dropArea.style.transform = "scale(1.02)";
            dropArea.style.borderColor = "#34c759"; 
            dropArea.style.background = "rgba(52, 199, 89, 0.05)";
        });
        dropArea.addEventListener("dragleave", function () {
            dropArea.style.transform = "scale(1)";
            dropArea.style.borderColor = "rgba(255,255,255,.45)";
            dropArea.style.background = "transparent";
        });
        dropArea.addEventListener("drop", function (e) {
            e.preventDefault();
            dropArea.style.transform = "scale(1)";
            dropArea.style.background = "transparent";
            dropArea.style.borderColor = "rgba(255,255,255,.45)";
            const file = e.dataTransfer.files[0];
            if (file) {
                if (imageInput) imageInput.files = e.dataTransfer.files;
                handleFileSelected(file);
            }
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener("submit", function () {
            if (imageInput && imageInput.files.length > 0) {
                if (loading) {
                    loading.style.transition = "opacity 0.4s ease-out";
                    loading.style.display = "flex";
                    loading.style.opacity = "0";
                    void loading.offsetWidth;
                    loading.style.opacity = "1";
                }
            }
        });
    }
});
