function parseTask(i: number): ITask {
  // LOG 1: See the line entering the task parser
  console.log(`--- parseTask started at line ${i}: "${lines[i]}" ---`);

  let subTasks: ISubTask[] = [];
  let task: ITask = {
    /* ... */
  };

  if (lines[i].match(/^-\s[.]/)) {
    console.log("parseTask: Line matches empty subtask prefix. Ignoring."); // LOG 2
    i++;
    return null;
  } else if (lines[i].match(/^-\s.*/)) {
    task.name = lines[i].replace(/^-\s/, "");
    console.log(`parseTask: Successfully matched task name: "${task.name}"`); // LOG 3
    i++;
  } else {
    console.log("parseTask: Line did not match a task format. Returning null."); // LOG 4
    i++;
    return null;
  }

  while (i < lines.length) {
    // LOG 5: See what the while loop is looking at
    console.log(`parseTask loop evaluating line ${i}: "${lines[i]}"`);

    if (lines[i].match(/^>/)) {
      // ... your status/priority extraction code ...

      // LOG 6: Verify details extraction
      console.log(
        `Extracted metadata -> Status: ${task.status}, Priority: ${task.priority}, Category: ${task.category}`,
      );
      i++;
    } else if (lines[i].trimStart().match(/^-\s[.]/)) {
      console.log(
        `parseTask: Found a subtask on line ${i}. Handing off to parseSubTask.`,
      ); // LOG 7
      subTasks.push(parseSubTask(i));
      i++;
    } else if (lines[i].trimStart().match(/^-\s/)) {
      task.notes = lines[i].trimStart().replace(/^-/, "");
      console.log(`parseTask: Captured note: "${task.notes}"`); // LOG 8
    } else {
      console.log(
        `parseTask loop broke at line ${i} because line pattern didn't match detail criteria.`,
      ); // LOG 9
      i++;
      break;
    }
  }

  console.log("parseTask complete. Returning task object:", task); // LOG 10
  return task;
}
