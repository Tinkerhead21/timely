import "../ui/types"
import * as fs from 'fs';

const fileContent = fs.readFileSync('src/io/testCases/test1.md', 'utf-8')

const lines: string[] = fileContent.split('\n');
var i: number = 0

function parseDay(): IDay {
    var day: IDay = {
        date: "", // file name
        projects: [] as IProject[]
    }

    while (i < lines.length) {
        if (lines[i].match(/^##\s\S/)) {
            day.projects.push(parseProject())
        }
        else {
            i++
            return null
        }
    }

    console.log("day:" + day)
    return day
}

function parseProject(): IProject {
    var project: IProject = {
        name: "",
        tasks: []
    }
    project.name = lines[i].trim()

    while (i < lines.length) {
        if (lines[i].match(/^##\s\S/)) {
        }
        else {
            project.tasks.push(parseTask(i))
        }
        i++
    }

    console.log("project:" + project)
    return project
}

// 

function parseTask(i: number): ITask {
    var subTasks: ISubTask[] = []
    var lineParts: string[] = []
    const task: ITask = {
        name: lineParts[1],
        status: lineParts[2],
        priority: lineParts[3] as Priority,
        category: lineParts[4],
        subtasks: subTasks[] as IsubTask,
        notes: ""
    }

    if (lines[i].match(/^\|\S\|/)) {
        lineParts = lines[i].split('|')
    }
    else if (lines[i].match(/^\s-[\s]/)) {
        // 1. boolean as no. 2. split after ] and push to subtask.name
        subTasks[].push(lines[i].split('|'))
    }
    else if (lines[i].match(/^\s-[x]/)) {
        // 1. boolean as no. 2. split after ] and push to subtask.name
        subTasks.push(lines[i])
    }
    else {
        console.log("task: no match")
        return null
    }
    console.log("task:" + task)
    return task
}
parseDay()
