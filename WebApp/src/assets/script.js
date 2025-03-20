/* NAV ACCODIAN - START */
var mainMenuesTitle = document.querySelectorAll('.nav-links-title');

// FOE OPPENING ACCODIAN
for (const mainMenuTitle of mainMenuesTitle) {
    mainMenuTitle.addEventListener('click', function() {
        let subMenuContainer = mainMenuTitle.nextElementSibling;
        if (mainMenuTitle.classList.contains('active')) {
            subMenuContainer.removeAttribute('style');
            mainMenuTitle.classList.remove('active');
        } else {
            mainMenuesRemoveActive().then((res) => {
                mainMenuTitle.classList.add('active');
                res ? subMenuContainer.setAttribute('style', `height:${subMenuContainer.scrollHeight}px; transition-delay: 0.2s;`) : subMenuContainer.setAttribute('style', `height:${subMenuContainer.scrollHeight}px;`);
            });
        }
    });
}

// FOR CLOSSING OTHER OPENED ACCODIAN
async function mainMenuesRemoveActive() {
    for (const mainMenuTitle of mainMenuesTitle) {
        if (mainMenuTitle.classList.contains("active")) {
            mainMenuTitle.classList.remove("active");
            let subMenuContainer = mainMenuTitle.nextElementSibling;
            subMenuContainer.removeAttribute('style');
            return true
        }
    }
}

/* NAV ACCODIAN - END */