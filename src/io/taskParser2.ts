import "../ui/types";
import * as fs from "fs";

const fileContent = fs.readFileSync("src/io/testCases/test1.md", "utf-8");
// break the lines + declare line index before parsing
const lines: string[] = fileContent.split("\n");
let i = 0;
// parseTask should only read function if the line is a task, else it should skip
console.log("lines: " + lines);
console.log("-----------------");

parseTask();

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
  console.log(`parseTask began at ${i}`);
  // In case a subtask(or any other case) is found before the task, the function ends
  if (lines[i].match(/^-\s[.]/)) {
    console.log(`subtask found at ${i}`);
    i++;
    return null;
  } else if (lines[i].match(/^-\s.*/)) {
    task.name = lines[i].replace(/^-\s/, "");
    console.log(`task found at ${i}`);
    i++;
  } else {
    i++;
    console.log(`line is neither task nor subtask at ${i}`);
    return null;
  }
  // After getting the task name, we need the details, subtasks, and notes
  while (i < lines.length) {
    if (lines[i].trimStart().match(/^>/)) {
      task.status = lines[i]
        .match(/^>.*\s/)
        .toString()
        .trim();
      task.status = task.status.replace(/^>/, "");
      task.priority = parseInt(
        lines[i]
          .match(/\s!.\s/)
          .toString()
          .replace("!", "")
          .trim(),
      ) as Priority;
      task.category = lines[i].match(/\s#.*\s/).toString();
      task.category = task.category.replace(/^#/, "").trim();
      console.log(`details found at ${i}`);
      i++;
    } else if (lines[i].trimStart().match(/^-\s[.]/)) {
      subTasks.push(parseSubTask());
      console.log(`subtask found at ${i}`);
      i++;
    } else if (lines[i].trimStart().match(/^-\s/)) {
      console.log(`notes found at ${i}`);
      task.notes = lines[i].trimStart().replace(/^-/, "");
    } else {
      console.log(`task parsing ended at ${i}`);
      i++;
      console.log(task);
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
  console.log(`parseSubTask began at ${i}`);
  if (lines[i].match(/^-\s\[\s\]/)) {
    // 1. boolean as no. 2. split after ] and push to subtask.name
    subTask.name = lines[i].split("]")[1];
    subTask.subStatus = false;
    console.log(`unchecked task found at ${i}`);
    i++;
  } else if (lines[i].match(/^-\s\[x\]/)) {
    // 1. boolean as no. 2. split after ] and push to subtask.name
    subTask.name = lines[i].split("]")[1];
    subTask.subStatus = true;
    console.log(`checked task found at ${i}`);
    i++;
  } else {
    console.log("subtask: no match");
    i++;
    return null;
  }
  console.log(subTask);
  return subTask;
}
// parseDay()
