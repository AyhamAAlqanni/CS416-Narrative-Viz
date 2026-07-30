# Narrative Visualization Project

This project is an interactive **narrative visualization** created to communicate a data-driven story through multiple scenes, visualizations, annotations, and user interactions.

The visualization guides the viewer through the main findings while also providing opportunities to interact with the data and explore additional information.

## 🌐 Live Visualization

The project is hosted using **GitHub Pages**.

**Live Website:** [View Narrative Visualization](https://ayhamaalqanni.github.io/CS416-Narrative-Viz/)

# Narrative Visualization Essay: Is AI a Tutor or a Cheat Code?

## 📖 Message

The main message of my narrative visualization is to explore the relationship between students’ generative AI usage and skill retention while considering AI dependency and burnout. The visualization is centred around the question, **“Is AI a Tutor or a Cheat Code?”**
The visualization does not assume that more AI usage automatically results in lower skill retention. The initial scatterplot shows that most students use AI for fewer than approximately 10 hours per week, while skill retention scores vary considerably. This show that AI usage alone may not tell the whole story, and factors such as dependency and burnout can provide additional context.

## 📊 Narrative Structure

The visualization follows a **martini glass structure**. The first scenes guide the viewer through a predefined story, beginning with AI usage and skill retention and then introducing AI dependency. The final scene allows viewers to explore the data themselves using filters for burnout risk, major, and primary AI use case. This moves the visualization from a guided narrative into open exploration.

## 🎨 Visual Structure

The visualization uses the same scatterplot throughout all three scenes:
- **X-axis:** Weekly Generative AI Usage (Hours)
- **Y-axis:** Skill Retention Score Each point represents a student record from the dataset. 
Keeping the same axes across scenes provides visual consistency and makes comparisons easier because viewers do not need to learn a new chart each time as each scene modifies or highlights information within the existing visualization.
The webpage also maintains a consistent visual layout. The narrative information, including the scene title, description, and annotation, appears alongside the visualization. Navigation controls clearly indicate the available scenes and allow the viewer to move forward or backward through the narrative.
Important information is emphasized through changes in point appearance, annotations, and filtering. For example, the dependency scene emphasizes students with higher perceived AI dependency while retaining the same positions of the points. This allows the viewer to compare the new information directly with the original relationship.

## 🎬 Scenes

The visualization contains three scenes:
- **Scene 1 — AI Usage and Skill Retention:** The first scene introduces the overall relationship between weekly generative AI usage and skill retention. The x-axis represents weekly AI usage in hours, and the y-axis represents skill retention score. The purpose of this scene is to establish the main variables and allow the viewer to understand the overall distribution.
- **Scene 2 — AI Dependency:** Keeps the same scatterplot but emphasizes students according to “Perceived_AI_Dependency” column. Students with higher dependency are visually emphasized, allowing the viewer to examine whether students who report greater reliance on AI appear in different areas of the AI usage and skill retention relationship.
- **Scene 3 — Burnout and Exploration:** The final scene introduces “Burnout_Risk_Level” and provides interactive filters for additional student characteristics. The viewer can filter the visualization by major category, burnout risk, and primary AI use case.
This scene appears last because the viewer has already been introduced to the primary relationship and AI dependency. The visualization can therefore transition from a guided narrative into independent exploration, allowing viewers to investigate questions that interest them.
**The order of the scenes:**
The scenes progress from **AI Usage → AI Dependency → Burnout and Exploration**. Each scene adds context without requiring the viewer to learn a completely different visualization.

## 📝 Annotations

The annotations follow a consistent short explanatory callout template. Annotations provide short messages that tell viewers what to focus on in each scene. For example, in the first scene the annotation encourages the viewer to examine the overall distribution of AI usage and skill retention. In the second scene, the annotation explains the visual emphasis placed on students with greater AI dependency. In the final scene, the annotation directs the viewer toward the interactive filters and encourages comparison across student groups.
The annotation content changes when the viewer transitions between scenes because the purpose of each scene is different. However, the general location and visual appearance of the annotations remain consistent. This allows the annotations to guide attention without disrupting the visual of the narrative.

## ⚙️ Parameters

The primary parameter is “currentScene”, which determines which of the three scenes is displayed:
- **“currentScene = 0”** → Represents Scene 1: AI Usage and Skill Retention.
- **“currentScene = 1”** → Represents Scene 2: AI Dependency.
- **“currentScene = 2”** → Represents Scene 3: Burnout and Exploration.

Changing this parameter determines which scene title, description, annotation, point emphasis, and interactive controls are displayed.
The visualization also uses the selected major, burnout level, and AI use case as parameters during the exploration scene. The default state displays all students, while changing one or more filters changes the state of the visualization and determines which information is displayed.
These parameters allow the visualization to maintain state without requiring separate webpages or separate visualizations for each scene.

## 🖱️ Triggers

The primary triggers are the “Next” and “Previous” buttons. Clicking these buttons changes the “currentScene” parameter and updates the narrative text, annotations, and visual representation of the scatterplot. They are disabled when the viewer cannot move farther in a particular direction.

The scene navigation buttons at the top of the webpage provides another trigger. They are visually styled as clickable controls, and the currently selected scene is highlighted. They allow viewers to move directly to a specific scene rather than progressing sequentially.

In the final scene, dropdown selections trigger filtering the scatterplot causes it to update and display the records that satisfy the selected conditions and indicates that additional categories can be selected. The “Reset Filters” button returns the filters to their original state and restores the original view.

Hovering over individual points in the scatterplot also triggers a tooltip containing additional information about the student record.

Together, these triggers allow the viewer to progress through the author guided narrative and then interact with the data independently during the final exploration stage.

## 🛠️ Technologies Used

The project was developed using:

* **HTML5** — Website structure
* **CSS3** — Styling and layout
* **JavaScript** — Interactivity and visualization logic
* **D3.js** — Data visualization
* **Git & GitHub** — Version control and source code hosting
* **GitHub Pages** — Website deployment and hosting

## 📁 Project Structure

```text
Narrative-Visualization/
│
├── index.html
├── README.md
├── Script.js
├── Style.css
├── Data/
│   └── AI_Student_Impact_Dataset.csv
```

## 🎯 Purpose

This project demonstrates the use of **narrative visualization techniques** to combine data analysis, storytelling, visual design, and interaction.

Rather than simply displaying charts, the visualization is designed to guide viewers through a meaningful story while still giving them opportunities to explore the data themselves.

## 🚀 Running the Project

The easiest way to view the project is through the GitHub Pages link above.

## 👤 Author

**Ayham Alqanni**

Master of Computer Science Student
University of Illinois Urbana-Champaign

---

*This project was developed as part of an academic narrative visualization assignment.*
