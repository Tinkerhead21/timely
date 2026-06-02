import "../ui/types";

export let lines: string[] = [];
export let i = 0;

const projects: IProject[] = [];
const day: IDay = {
  dd: "day",
  mm: "month",
  yy: "year",
  projects: projects,
};

export function parseDay(
  fileContent: string,
  dd: string,
  mm: string,
  yy: string,
): IDay {
  lines = fileContent.split(/\r?\n/);
  i = 0;
  day.dd = dd;
  day.mm = mm;
  day.yy = yy;
  day.projects = [];
  for (; i < lines.length; i++) {
    if (lines[i].match(/^##\s/)) {
      day.projects.push(parseProject());
    }
  }
  return day;
}

function parseProject(): IProject {
  const tasks: ITask[] = [];
  const project: IProject = {
    name: "",
    tasks: tasks,
  };
  const projectMatch = lines[i].match(/^##\s(.*)/);
  project.name = projectMatch ? projectMatch[1] : "Untitled Project";
  i++;
  for (; i < lines.length; i++) {
    if (lines[i].match(/^-\s/)) {
      project.tasks.push(parseTask());
    } else {
      break;
    }
  }
  return project;
}

function parseTask(): ITask {
  const subTasks: ISubTask[] = [];
  const task: ITask = {
    name: "",
    status: "",
    priority: 3 as Priority,
    category: "",
    subtasks: subTasks,
    notes: "",
  };

  task.name = lines[i].match(/^-\s(.*)/)[1];
  i++;

  for (; i < lines.length; i++) {
    if (lines[i].trimStart().match(/^>/)) {
      const statusMatch = lines[i].trimStart().match(/^>([^\s]*)/);
      const priorityMatch = lines[i].match(/\s!(\d)/);
      const categoryMatch = lines[i].match(/\s#([^\s]*)/);

      task.status = statusMatch ? statusMatch[1] : "todo";
      task.priority = priorityMatch
        ? (parseInt(priorityMatch[1]) as Priority)
        : (3 as Priority);
      task.category = categoryMatch ? categoryMatch[1] : "";
    } else if (lines[i].trimStart().match(/^-\s\[.\]\s./)) {
      subTasks.push(parseSubTask());
    } else if (lines[i].trimStart().match(/^-\s./)) {
      task.notes = lines[i].trimStart().match(/^-\s(.*)/)[1];
    } else {
      break;
    }
  }
  return task;
}

function parseSubTask(): ISubTask {
  const subTask: ISubTask = {
    name: "",
    subStatus: false,
  };
  subTask.name = lines[i].match(/^-\s\[.\]\s(.*)/)[1];
  if (lines[i].trimStart().match(/^-\s\[\s\]/)) {
    subTask.subStatus = false;
  } else if (lines[i].trimStart().match(/^-\s\[\S\]/)) {
    subTask.subStatus = true;
  }
  return subTask;
}
