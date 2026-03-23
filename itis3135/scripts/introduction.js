// This is the default image that will be used if the user does not upload a new one.
// Replace this path if your image lives somewhere else in your project.
const DEFAULT_IMAGE_PATH = "itis3135/images/toppng.com-biggie-cheese-600x700.png";

// This variable stores the image currently being used.
// It starts as the default image, but changes if the user uploads a file.
let currentImageSrc = DEFAULT_IMAGE_PATH;

/*
    Grab the main HTML elements we need to work with.
    These constants let us easily access parts of the page in our functions.
*/
const form = document.getElementById("intro-form");
const outputSection = document.getElementById("output-section");
const pageHeading = document.getElementById("page-heading");
const coursesContainer = document.getElementById("courses-container");
const addCourseButton = document.getElementById("add-course");
const clearFormButton = document.getElementById("clear-form");
const generateJsonButton = document.getElementById("generate-json");
const generateHtmlButton = document.getElementById("generate-html");
const imageUploadInput = document.getElementById("image-upload");
const formInstructions = document.getElementById("form-instructions");

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function setupImagePreview() {
    imageUploadInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            currentImageSrc = URL.createObjectURL(file);
        } else {
            currentImageSrc = DEFAULT_IMAGE_PATH;
        }
    });
}

function createCourseEntry() {
    const div = document.createElement("div");
    div.className = "course-entry";
    div.innerHTML = `
        <label>Department *</label>
        <input type="text" class="course-department" placeholder="Department" required>

        <label>Number *</label>
        <input type="text" class="course-number" placeholder="Course number" required>

        <label>Name *</label>
        <input type="text" class="course-name" placeholder="Course name" required>

        <label>Reason *</label>
        <textarea class="course-reason" rows="2" placeholder="Why are you taking this course?" required></textarea>

        <button type="button" class="remove-course">Remove Course</button>
    `;
    coursesContainer.appendChild(div);
}

function removeCourseHandler(event) {
    if (event.target.classList.contains("remove-course")) {
        const courseEntries = document.querySelectorAll(".course-entry");

        if (courseEntries.length > 1) {
            event.target.closest(".course-entry").remove();
        } else {
            alert("You must have at least one course.");
        }
    }
}

function clearFormFields() {
    const textInputs = form.querySelectorAll('input[type="text"], input[type="url"], input[type="date"], textarea');
    textInputs.forEach((field) => {
        field.value = "";
    });

    imageUploadInput.value = "";
    currentImageSrc = DEFAULT_IMAGE_PATH;

    const extraCourseEntries = document.querySelectorAll(".course-entry");
    extraCourseEntries.forEach((entry, index) => {
        if (index > 0) {
            entry.remove();
        }
    });

    outputSection.innerHTML = "";
    form.style.display = "block";
    pageHeading.textContent = "Introduction Form";
}

function getLinks() {
    return [
        {
            name: document.getElementById("link1-name").value.trim(),
            url: document.getElementById("link1-url").value.trim()
        },
        {
            name: document.getElementById("link2-name").value.trim(),
            url: document.getElementById("link2-url").value.trim()
        },
        {
            name: document.getElementById("link3-name").value.trim(),
            url: document.getElementById("link3-url").value.trim()
        },
        {
            name: document.getElementById("link4-name").value.trim(),
            url: document.getElementById("link4-url").value.trim()
        },
        {
            name: document.getElementById("link5-name").value.trim(),
            url: document.getElementById("link5-url").value.trim()
        }
    ].filter((link) => link.name && link.url);
}

function getCourses() {
    const courseEntries = document.querySelectorAll(".course-entry");

    return Array.from(courseEntries).map((entry) => {
        return {
            department: entry.querySelector(".course-department").value.trim(),
            number: entry.querySelector(".course-number").value.trim(),
            name: entry.querySelector(".course-name").value.trim(),
            reason: entry.querySelector(".course-reason").value.trim()
        };
    });
}

function getFormData() {
    return {
        firstName: document.getElementById("first-name").value.trim(),
        middleName: document.getElementById("middle-name").value.trim(),
        nickname: document.getElementById("nickname").value.trim(),
        lastName: document.getElementById("last-name").value.trim(),
        divider: document.getElementById("divider").value.trim(),
        mascotAdjective: document.getElementById("mascot-adjective").value.trim(),
        mascotAnimal: document.getElementById("mascot-animal").value.trim(),
        acknowledgement: document.getElementById("acknowledgement").value.trim(),
        acknowledgementDate: document.getElementById("ack-date").value,
        imageSrc: currentImageSrc,
        imageCaption: document.getElementById("image-caption").value.trim(),
        introParagraph: document.getElementById("intro-paragraph").value.trim(),
        personalBackground: document.getElementById("personal-background").value.trim(),
        professionalBackground: document.getElementById("professional-background").value.trim(),
        academicBackground: document.getElementById("academic-background").value.trim(),
        subjectBackground: document.getElementById("subject-background").value.trim(),
        primaryComputer: document.getElementById("primary-computer").value.trim(),
        backupComputer: document.getElementById("backup-computer").value.trim(),
        funnyThing: document.getElementById("funny-thing").value.trim(),
        shareMore: document.getElementById("share-more").value.trim(),
        quoteText: document.getElementById("quote-text").value.trim(),
        quoteAuthor: document.getElementById("quote-author").value.trim(),
        courses: getCourses(),
        links: getLinks()
    };
}

function buildDisplayName(data) {
    let fullName = data.firstName;

    if (data.middleName) {
        fullName += ` ${data.middleName}`;
    }

    if (data.nickname) {
        fullName += ` "${data.nickname}"`;
    }

    fullName += ` ${data.lastName}`;

    return `${fullName} ${data.divider} ${data.mascotAdjective} ${data.mascotAnimal}`;
}

function buildLinksHtml(links) {
    if (!links.length) {
        return "";
    }

    const linkItems = links.map((link) => {
        return `<a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.name)}</a>`;
    });

    return `<p>${linkItems.join(" | ")}</p>`;
}

function buildCoursesHtml(courses) {
    const courseItems = courses.map((course) => {
        return `
            <li>
                ${escapeHtml(course.department)} ${escapeHtml(course.number)} - ${escapeHtml(course.name)}:
                ${escapeHtml(course.reason)}
            </li>
        `;
    }).join("");

    return `<ol>${courseItems}</ol>`;
}

function buildIntroductionHtml(data) {
    const funnyThingHtml = data.funnyThing
        ? `<li><strong>Funny Thing:</strong> ${escapeHtml(data.funnyThing)}</li>`
        : "";

    const shareMoreHtml = data.shareMore
        ? `<li><strong>I'd also like to share:</strong> ${escapeHtml(data.shareMore)}</li>`
        : "";

    return `
        <h3>${escapeHtml(buildDisplayName(data))}</h3>

        <figure class="img-card">
            <img src="${escapeHtml(data.imageSrc)}" alt="${escapeHtml(data.imageCaption)}">
            <figcaption>${escapeHtml(data.imageCaption)}</figcaption>
        </figure>

        <p>${escapeHtml(data.introParagraph)}</p>

        <ul>
            <li><strong>Acknowledgement:</strong> ${escapeHtml(data.acknowledgement)}</li>
            <li><strong>Acknowledgement Date:</strong> ${escapeHtml(data.acknowledgementDate)}</li>
            <li><strong>Personal Background:</strong> ${escapeHtml(data.personalBackground)}</li>
            <li><strong>Professional Background:</strong> ${escapeHtml(data.professionalBackground)}</li>
            <li><strong>Academic Background:</strong> ${escapeHtml(data.academicBackground)}</li>
            <li><strong>Background in Subject:</strong> ${escapeHtml(data.subjectBackground)}</li>
            <li><strong>Primary Work Computer and Location:</strong> ${escapeHtml(data.primaryComputer)}</li>
            <li><strong>Backup Work Computer and Location Plan:</strong> ${escapeHtml(data.backupComputer)}</li>
            <li>
                <strong>Current Courses:</strong>
                ${buildCoursesHtml(data.courses)}
            </li>
            ${funnyThingHtml}
            ${shareMoreHtml}
        </ul>

        <blockquote>
            "${escapeHtml(data.quoteText)}" - ${escapeHtml(data.quoteAuthor)}
        </blockquote>

        ${buildLinksHtml(data.links)}

        <p><a href="#" id="start-over-link">Reset / Start Over</a></p>
    `;
}

function buildJsonOutput(data) {
    const jsonData = {
        first_name: data.firstName,
        middle_name: data.middleName,
        preferred_name: data.nickname,
        last_name: data.lastName,
        divider: data.divider,
        mascot_adjective: data.mascotAdjective,
        mascot_animal: data.mascotAnimal,
        acknowledgement: data.acknowledgement,
        acknowledgement_date: data.acknowledgementDate,
        image: data.imageSrc,
        image_caption: data.imageCaption,
        introduction_paragraph: data.introParagraph,
        personal_background: data.personalBackground,
        professional_background: data.professionalBackground,
        academic_background: data.academicBackground,
        subject_background: data.subjectBackground,
        primary_computer: data.primaryComputer,
        backup_computer: data.backupComputer,
        funny_thing: data.funnyThing,
        share_more: data.shareMore,
        quote_text: data.quoteText,
        quote_author: data.quoteAuthor,
        courses: data.courses,
        links: data.links
    };

    return `
        <section class="code-output">
            <pre><code>${escapeHtml(JSON.stringify(jsonData, null, 4))}</code></pre>
            <p><a href="#" id="start-over-link">Reset / Start Over</a></p>
        </section>
    `;
}

function buildHtmlCodeOutput(data) {
    const courseListItems = data.courses.map((course) => {
        return `        <li>${course.department} ${course.number} - ${course.name}: ${course.reason}</li>`;
    }).join("\n");

    const htmlText = `<h3>${buildDisplayName(data)}</h3>
<figure class="img-card">
    <img src="${data.imageSrc}" alt="${data.imageCaption}">
    <figcaption>${data.imageCaption}</figcaption>
</figure>

<p>${data.introParagraph}</p>

<ul>
    <li><strong>Acknowledgement:</strong> ${data.acknowledgement}</li>
    <li><strong>Acknowledgement Date:</strong> ${data.acknowledgementDate}</li>
    <li><strong>Personal Background:</strong> ${data.personalBackground}</li>
    <li><strong>Professional Background:</strong> ${data.professionalBackground}</li>
    <li><strong>Academic Background:</strong> ${data.academicBackground}</li>
    <li><strong>Background in Subject:</strong> ${data.subjectBackground}</li>
    <li><strong>Primary Work Computer and Location:</strong> ${data.primaryComputer}</li>
    <li><strong>Backup Work Computer and Location Plan:</strong> ${data.backupComputer}</li>
    <li>
        <strong>Current Courses:</strong>
        <ol>
${courseListItems}
        </ol>
    </li>
    ${data.funnyThing ? `<li><strong>Funny Thing:</strong> ${data.funnyThing}</li>` : ""}
    ${data.shareMore ? `<li><strong>I'd also like to share:</strong> ${data.shareMore}</li>` : ""}
</ul>

<blockquote>"${data.quoteText}" - ${data.quoteAuthor}</blockquote>`;

    return `
        <section class="code-output">
            <pre><code>${escapeHtml(htmlText)}</code></pre>
            <p><a href="#" id="start-over-link">Reset / Start Over</a></p>
        </section>
    `;
}

function attachStartOverHandler() {
    const startOverLink = document.getElementById("start-over-link");

    if (startOverLink) {
        startOverLink.addEventListener("click", function (event) {
            event.preventDefault();
            outputSection.innerHTML = "";
            form.style.display = "block";
            formInstructions.style.display = "block";
            pageHeading.textContent = "Introduction Form";
        });
    }
}

function showRenderedIntroduction() {
    if (!form.reportValidity()) {
        return;
    }

    const data = getFormData();
    pageHeading.textContent = "Introduction Form";
    outputSection.innerHTML = buildIntroductionHtml(data);
    form.style.display = "none";
    formInstructions.style.display = "none";
    attachStartOverHandler();
}

function showJsonOutput() {
    if (!form.reportValidity()) {
        return;
    }

    const data = getFormData();
    pageHeading.textContent = "Introduction JSON";
    outputSection.innerHTML = buildJsonOutput(data);
    form.style.display = "none";
    attachStartOverHandler();
}

function showHtmlOutput() {
    if (!form.reportValidity()) {
        return;
    }

    const data = getFormData();
    pageHeading.textContent = "Introduction HTML";
    outputSection.innerHTML = buildHtmlCodeOutput(data);
    form.style.display = "none";
    attachStartOverHandler();
}



form.addEventListener("submit", function (event) {
    event.preventDefault();
    showRenderedIntroduction();
});

addCourseButton.addEventListener("click", createCourseEntry);
coursesContainer.addEventListener("click", removeCourseHandler);
clearFormButton.addEventListener("click", clearFormFields);
generateJsonButton.addEventListener("click", showJsonOutput);
generateHtmlButton.addEventListener("click", showHtmlOutput);

setupImagePreview();