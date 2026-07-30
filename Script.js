"use strict";

/* =========================================================
   1. NARRATIVE STATE
   ========================================================= */

/*
    0 = Overall AI usage and skill retention
    1 = AI dependency
    2 = Burnout and exploration
*/
let currentScene = 0;

/*
    Will contain all 50,000 student records after the CSV file finishes loading.
*/
let studentData = [];

/*
    Will contain a smaller sample to draw the SVG scatterplot.
*/
let displayedData = [];

const scenes = [
    {
        number: "Scene 1 of 3",

        title: "How is AI usage related to skill retention?",

        description:
            "This scene introduces the overall relationship between weekly " +
            "generative AI usage and students’ skill-retention scores.",

        annotation:
            "Look at the overall distribution of students before considering " +
            "AI dependency and burnout.",

        chartSubtitle:
            "Each point represents a sampled student record. Move your pointer " +
            "over a point to see that student’s information.",

        showExploration: false
    },

    {
        number: "Scene 2 of 3",

        title: "Does AI dependency change the picture?",

        description:
            "The same student records are now emphasized according to their " +
            "reported level of AI dependency.",

        annotation:
            "Compare students with lower and higher dependency levels to see " +
            "whether they occupy different areas of the scatterplot.",

        chartSubtitle:
            "The axes remain unchanged, but point appearance now represents " +
            "students’ perceived AI dependency.",

        showExploration: false
    },

    {
        number: "Scene 3 of 3",

        title: "How do burnout and student characteristics affect the pattern?",

        description:
            "The final scene introduces burnout and allows users to explore " +
            "the relationship by major, burnout risk, and primary AI use case.",

        annotation:
            "Use the filters to determine whether the overall relationship " +
            "remains consistent across different groups of students.",

        chartSubtitle:
            "Filter the student records and examine individual points using " +
            "the interactive tooltip.",

        showExploration: true
    }
];

/* =========================================================
   2. HTML ELEMENT SELECTIONS
   ========================================================= */

const sceneNumber = document.querySelector("#scene-number");
const sceneTitle = document.querySelector("#scene-title");
const sceneDescription = document.querySelector("#scene-description");
const annotation = document.querySelector("#annotation");
const chartSubtitle = document.querySelector("#chart-subtitle");
const sceneProgress = document.querySelector("#scene-progress");
const explorationPanel = document.querySelector("#exploration-panel");

const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const sceneButtons = document.querySelectorAll(".scene-button");

const majorFilter = document.querySelector("#major-filter");
const burnoutFilter = document.querySelector("#burnout-filter");
const useCaseFilter = document.querySelector("#use-case-filter");
const resetFiltersButton = document.querySelector("#reset-filters");

const tooltip = d3.select("#tooltip");

/* =========================================================
   3. CHART DIMENSIONS
   ========================================================= */

/*
    These dimensions match the SVG viewBox values in index.html.
*/
const chartWidth = 900;
const chartHeight = 550;

const margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

/*
    The inner chart area excludes the margins.
*/
const innerWidth =
    chartWidth - margin.left - margin.right;

const innerHeight =
    chartHeight - margin.top - margin.bottom;

/* =========================================================
   4. CREATE THE SVG CHART STRUCTURE
   ========================================================= */

/*
    Selecting SVG from index.html.
*/
const svg = d3.select("#scatterplot");

const chartGroup = svg
    .append("g")
    .attr(
        "transform",
        `translate(${margin.left}, ${margin.top})`
    );

/*
    Creating groups that will later contain the x-axis and y-axis.
*/
const xAxisGroup = chartGroup
    .append("g")
    .attr(
        "transform",
        `translate(0, ${innerHeight})`
    );

const yAxisGroup = chartGroup
    .append("g");

/*
    Creating a separate group for the data points.
*/
const pointsGroup = chartGroup
    .append("g")
    .attr("class", "points-group");

/*
    Creating a separate group for SVG annotations.
*/
const annotationGroup = chartGroup
    .append("g")
    .attr("class", "chart-annotations");

/* =========================================================
   5. CREATE AXIS LABELS
   ========================================================= */

/*
    X-axis title.
*/
chartGroup
    .append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 60)
    .attr("text-anchor", "middle")
    .text("Weekly Generative AI Usage (Hours)");

/*
    Y-axis title.
*/
chartGroup
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -65)
    .attr("text-anchor", "middle")
    .text("Skill Retention Score");

/* =========================================================
   6. DEFINE THE SCALES
   ========================================================= */

const xScale = d3
    .scaleLinear()
    .range([0, innerWidth]);

const yScale = d3
    .scaleLinear()
    .range([innerHeight, 0]);

/* =========================================================
   7. LOAD AND PREPARE THE CSV DATA
   ========================================================= */

d3.csv(
    "Data/AI_Student_Impact_Dataset.csv",
    convertRow
)
    .then((data) => {
        /*
            Keep only rows that contain valid numeric values.
        */
        studentData = data.filter((student) => {
            return (
                Number.isFinite(student.weeklyAIHours) &&
                Number.isFinite(student.skillRetention)
            );
        });

        /*
            Selecting every tenth record.

            Approximately 5,000 of the 50,000 records will be
            drawn as SVG circles. To improve performance.
        */
        displayedData = studentData.filter(
            (student, index) => index % 10 === 0
        );

        console.log(
            `Loaded ${studentData.length} valid student records.`
        );

        console.log(
            `Displaying ${displayedData.length} sampled records.`
        );

        /*
            Configuring the scales using the complete dataset,
            not only the displayed sample.
        */
        configureScales(studentData);

        /*
            Drawing the axes.
        */
        drawAxes();

        /*
            Adding filter options using the dataset categories.
        */
        populateFilters(studentData);

        /*
            Displaying the first narrative scene.
        */
        updateScene();
    })
    .catch((error) => {
        console.error("The CSV file could not be loaded:", error);

        sceneTitle.textContent = "Unable to load the dataset";

        sceneDescription.textContent =
            "Check that the CSV file is located inside the data folder " +
            "and that its filename is correct.";
    });

/* =========================================================
   8. CONVERT EACH CSV ROW
   ========================================================= */

function convertRow(row) {
    return {
        studentID: row.Student_ID,

        major: row.Major_Category,

        yearOfStudy: row.Year_of_Study,

        weeklyAIHours: Number(row.Weekly_GenAI_Hours),

        skillRetention: Number(row.Skill_Retention_Score),

        dependency: Number(row.Perceived_AI_Dependency),

        burnout: row.Burnout_Risk_Level,

        primaryUseCase: row.Primary_Use_Case,

        traditionalStudyHours:
            Number(row.Traditional_Study_Hours),

        preSemesterGPA:
            Number(row.Pre_Semester_GPA),

        postSemesterGPA:
            Number(row.Post_Semester_GPA)
    };
}

/* =========================================================
   9. CONFIGURE THE SCALES
   ========================================================= */

function configureScales(data) {
    /*
        d3.extent returns the minimum and maximum value.
    */
    const aiHoursExtent = d3.extent(
        data,
        (student) => student.weeklyAIHours
    );

    const retentionExtent = d3.extent(
        data,
        (student) => student.skillRetention
    );

    /*
        nice() rounds the domains to cleaner values for axes.
    */
    xScale
        .domain(aiHoursExtent)
        .nice();

    yScale
        .domain(retentionExtent)
        .nice();
}

/* =========================================================
   10. DRAW THE AXES
   ========================================================= */

function drawAxes() {
    const xAxis = d3
        .axisBottom(xScale)
        .ticks(10);

    const yAxis = d3
        .axisLeft(yScale)
        .ticks(10);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
}

/* =========================================================
   11. UPDATE THE NARRATIVE SCENE
   ========================================================= */

function updateScene() {
    const scene = scenes[currentScene];

    sceneNumber.textContent = scene.number;
    sceneTitle.textContent = scene.title;
    sceneDescription.textContent = scene.description;
    annotation.textContent = scene.annotation;
    chartSubtitle.textContent = scene.chartSubtitle;
    sceneProgress.textContent = scene.number;

    explorationPanel.hidden = !scene.showExploration;

    previousButton.disabled = currentScene === 0;
    nextButton.disabled =
        currentScene === scenes.length - 1;

    nextButton.textContent =
        currentScene === scenes.length - 1
            ? "End of Scenes"
            : "Next →";

    sceneButtons.forEach((button, index) => {
        const isActive = index === currentScene;

        button.classList.toggle("active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "step");
        } else {
            button.removeAttribute("aria-current");
        }
    });

    /*
        Updating the scatterplot based on currentScene.
    */
    renderScene();
}

/* =========================================================
   12. RENDER THE APPROPRIATE CHART SCENE
   ========================================================= */

function renderScene() {
    if (currentScene === 0) {
        renderOverallScene();
    } else if (currentScene === 1) {
        renderDependencyScene();
    } else {
        renderExplorationScene();
    }
}

/* =========================================================
   13. SCENE 1: OVERALL RELATIONSHIP
   ========================================================= */

function renderOverallScene() {
    /*
        Removing any annotations left by another scene.
    */
    annotationGroup
        .selectAll("*")
        .remove();

    /*
        Binding the sampled student data to SVG circles.
    */
    const circles = pointsGroup
        .selectAll("circle")
        .data(
            displayedData,
            (student) => student.studentID
        );

    /*
        Removing circles that no longer belong in the dataset.
    */
    circles
        .exit()
        .remove();

    /*
        Creating circles for new records.
    */
    const enteredCircles = circles
        .enter()
        .append("circle")
        .attr("class", "student-point")
        .attr("r", 3)
        .attr(
            "cx",
            (student) => xScale(student.weeklyAIHours)
        )
        .attr(
            "cy",
            (student) => yScale(student.skillRetention)
        );

    /*
        Combining existing circles with newly created circles.
    */
    enteredCircles
        .merge(circles)
        .attr(
            "cx",
            (student) => xScale(student.weeklyAIHours)
        )
        .attr(
            "cy",
            (student) => yScale(student.skillRetention)
        )
        .attr("r", 3)
        .attr("opacity", 0.35)
        .on("mouseenter", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    //addOverallAnnotation();
}

/* =========================================================
   14. SCENE 2: DEPENDENCY
   ========================================================= */

function renderDependencyScene() {
    annotationGroup
        .selectAll("*")
        .remove();

    const circles = pointsGroup
        .selectAll("circle")
        .data(
            displayedData,
            (student) => student.studentID
        );

    circles
        .attr(
            "cx",
            (student) => xScale(student.weeklyAIHours)
        )
        .attr(
            "cy",
            (student) => yScale(student.skillRetention)
        )
        .attr("r", (student) => {
            return student.dependency >= 4 ? 4.5 : 2.5;
        })
        .attr("opacity", (student) => {
            return student.dependency >= 4 ? 0.75 : 0.15;
        })
        .on("mouseenter", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    addDependencyAnnotation();
}

/* =========================================================
   15. SCENE 3: EXPLORATION
   ========================================================= */

function renderExplorationScene() {
    annotationGroup
        .selectAll("*")
        .remove();

    applyFilters();
}

/* =========================================================
   16. BASIC SVG ANNOTATIONS
   ========================================================= */

/*function addOverallAnnotation() {
    annotationGroup
        .append("text")
        .attr("class", "svg-annotation")
        .attr("x", innerWidth * 0.58)
        .attr("y", 20)
        .text("Examine the overall distribution.");
}*/

function addDependencyAnnotation() {
    annotationGroup
        .append("text")
        .attr("class", "svg-annotation")
        .attr("x", innerWidth * 0.53)
        .attr("y", 20)
        .text("Larger, darker points indicate higher dependency.");
}

/* =========================================================
   17. TOOLTIP FUNCTIONS
   ========================================================= */

function showTooltip(event, student) {
    tooltip
        .style("display", "block")
        .html(`
            <strong>Student ${student.studentID}</strong><br>
            Weekly AI use:
            ${student.weeklyAIHours.toFixed(2)} hours<br>
            Skill retention:
            ${student.skillRetention.toFixed(2)}<br>
            AI dependency:
            ${student.dependency}<br>
            Burnout risk:
            ${student.burnout}<br>
            Major:
            ${student.major}<br>
            Primary use:
            ${student.primaryUseCase}
        `);

    moveTooltip(event);
}

function moveTooltip(event) {
    tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY + 15}px`);
}

function hideTooltip() {
    tooltip.style("display", "none");
}

/* =========================================================
   18. POPULATE FILTER DROPDOWNS
   ========================================================= */

function populateFilters(data) {
    const majors = Array.from(
        new Set(data.map((student) => student.major))
    ).sort();

    const burnoutLevels = Array.from(
        new Set(data.map((student) => student.burnout))
    ).sort();

    const useCases = Array.from(
        new Set(
            data.map((student) => student.primaryUseCase)
        )
    ).sort();

    addOptions(majorFilter, majors);
    addOptions(burnoutFilter, burnoutLevels);
    addOptions(useCaseFilter, useCases);
}

function addOptions(selectElement, options) {
    options.forEach((optionValue) => {
        const option = document.createElement("option");

        option.value = optionValue;
        option.textContent = optionValue;

        selectElement.appendChild(option);
    });
}

/* =========================================================
   19. FILTER THE DATA
   ========================================================= */

function applyFilters() {
    const selectedMajor = majorFilter.value;
    const selectedBurnout = burnoutFilter.value;
    const selectedUseCase = useCaseFilter.value;

    const filteredData = displayedData.filter((student) => {
        const matchesMajor =
            selectedMajor === "All" ||
            student.major === selectedMajor;

        const matchesBurnout =
            selectedBurnout === "All" ||
            student.burnout === selectedBurnout;

        const matchesUseCase =
            selectedUseCase === "All" ||
            student.primaryUseCase === selectedUseCase;

        return (
            matchesMajor &&
            matchesBurnout &&
            matchesUseCase
        );
    });

    const circles = pointsGroup
        .selectAll("circle")
        .data(
            filteredData,
            (student) => student.studentID
        );

    circles
        .exit()
        .remove();

    const enteredCircles = circles
        .enter()
        .append("circle")
        .attr("class", "student-point")
        .attr("r", 3)
        .attr(
            "cx",
            (student) => xScale(student.weeklyAIHours)
        )
        .attr(
            "cy",
            (student) => yScale(student.skillRetention)
        );

    enteredCircles
        .merge(circles)
        .attr(
            "cx",
            (student) => xScale(student.weeklyAIHours)
        )
        .attr(
            "cy",
            (student) => yScale(student.skillRetention)
        )
        .attr("r", 3)
        .attr("opacity", 0.45)
        .on("mouseenter", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);
}

/* =========================================================
   20. FILTER TRIGGERS
   ========================================================= */

majorFilter.addEventListener("change", applyFilters);
burnoutFilter.addEventListener("change", applyFilters);
useCaseFilter.addEventListener("change", applyFilters);

resetFiltersButton.addEventListener("click", () => {
    majorFilter.value = "All";
    burnoutFilter.value = "All";
    useCaseFilter.value = "All";

    applyFilters();
});

/* =========================================================
   21. SCENE NAVIGATION TRIGGERS
   ========================================================= */

nextButton.addEventListener("click", () => {
    if (currentScene < scenes.length - 1) {
        currentScene += 1;
        updateScene();
    }
});

previousButton.addEventListener("click", () => {
    if (currentScene > 0) {
        currentScene -= 1;
        updateScene();
    }
});

sceneButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentScene = Number(button.dataset.scene);
        updateScene();
    });
});

document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;

    /*
        Do not change scenes while a dropdown has focus.
    */
    if (activeElement.tagName === "SELECT") {
        return;
    }

    if (
        event.key === "ArrowRight" &&
        currentScene < scenes.length - 1
    ) {
        currentScene += 1;
        updateScene();
    }

    if (
        event.key === "ArrowLeft" &&
        currentScene > 0
    ) {
        currentScene -= 1;
        updateScene();
    }
});