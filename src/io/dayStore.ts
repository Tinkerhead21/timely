import { moment } from "obsidian";
import { parseDay, lines, i } from "./taskParser";

export async function loadFromFileContent(app, file) {
  const fileContent = await app.vault.read(file);
  const coreFormat =
    app.internalPlugins.plugins["daily-notes"]?.instance?.options?.format;
  const periodicFormat =
    app.plugins.plugins["periodic-notes"]?.settings?.daily?.format;
  const userFormat = coreFormat || periodicFormat || "YYYY-MM-DD";
  // needs to be converted to unified format using moment
  const dateToken = moment(file.basename, userFormat);
  console.log(dateToken);

  const dd = dateToken.format("DD");
  const mm = dateToken.format("MMMM");
  const yy = dateToken.format("YYYY");

  return parseDay(fileContent, dd, mm, yy);
}

export function renderDayToUI(containerEl: HTMLElement, dayData: any) {
  containerEl.empty();

  // 📅 1. Render the date heading
  const dateHeader = containerEl.createEl("h1");
  dateHeader.setText(`${dayData.dd} ${dayData.mm} ${dayData.yy}`);

  // 📂 2. Render each project section
  dayData.projects.forEach((project: any) => {
    const projectSection = containerEl.createDiv();
    const projectTitle = projectSection.createEl("h2");
    projectTitle.setText(project.name);

    const taskList = projectSection.createEl("ul");

    // 📋 3. Render each task
    project.tasks.forEach((task: any) => {
      const taskItem = taskList.createEl("li");
      let taskText = `[ ] ${task.name}`;
      if (task.priority) taskText += ` (Priority: ${task.priority})`;
      if (task.category) taskText += ` #${task.category}`;
      taskItem.setText(taskText);

      // 🌿 4. Render nested subtasks if they exist
      if (task.subtasks && task.subtasks.length > 0) {
        const subtaskList = taskItem.createEl("ul");
        task.subtasks.forEach((sub: any) => {
          const subItem = subtaskList.createEl("li");
          subItem.setText(`- ${sub.name}`);
        });
      }
    });
  });
}
