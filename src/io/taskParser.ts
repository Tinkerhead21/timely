import "../ui/types"
import * as fs from 'fs';

const fileContent = fs.readFileSync('src/io/testCases/test1.md', 'utf-8')

const lines: string[] = fileContent.split('\n');
var i: number = 0

// function parseDay(): IDay {
//     var day: IDay = {
//         date: "", // file name
//         projects: [] as IProject[]
//     }

//     while (i < lines.length) {
//         if (lines[i].match(/^##\s\S/)) {
//             day.projects.push(parseProject())
//         }
//         else {
//             i++
//             return null
//         }
//     }

//     console.log("day:" + day)
//     return day
// }

// function parseProject(): IProject {
//     var project: IProject = {
//         name: "",
//         tasks: []
//     }
//     project.name = lines[i].trim()
//     i++

//     while (i < lines.length) {
//         if (lines[i].match(/^##\s\S/)) {
//             break;
//         }
//         else {
//             project.tasks.push(parseTask(i))
//         }
//     }

//     console.log("project:" + project)
//     return project
// }
lines[1] = `| Write docs | in-progress | low | docs |
- Fix bug 123
- [ ] Check console logs
- [x] Identify root cause`

function parseTask(i: number): ITask {
    var subTasks: ISubTask[] = []
    var lineParts: string[] = []
    const task: ITask = {
        name: lineParts[1],
        status: lineParts[2],
        priority: lineParts[3] as Priority,
        category: lineParts[4],
        subtasks: subTasks,
        notes: ""
    }
    if (lines[i].match(/^\|.*?\|/)) {
        lineParts = lines[i].split('|')
        i++
    }
    else {
        i++
        return null
    }
    while (i < lines.length) {
        if (lines[i].match(/^-\s[.]/)) {
            subTasks.push(parseSubTask(i))
            i++
        }
        else {
            console.log("subtask: no match")
            i++
            return null
        }
    }
    return task
}

function parseSubTask(i: number): ISubTask {
    var subTask: ISubTask = {
        name: "",
        subStatus: false
    }
    if (lines[i].match(/^\-\s\[\s\]/)) {
        // 1. boolean as no. 2. split after ] and push to subtask.name
        subTask.name = lines[i].split(']')[1]
        subTask.subStatus = false
    }
    else if (lines[i].match(/^\-\s\[x\]/)) {
        // 1. boolean as no. 2. split after ] and push to subtask.name
        subTask.name = lines[i].split(']')[1]
        subTask.subStatus = true
    }
    else {
        console.log("subtask: no match")
        return null
    }

    return subTask

}
console.log(parseTask(1))
// parseDay()
