import "@/model/types"

const fileContent = "## project1\n task1\n | task2 |\n - [ ] subtask1\n - [x] subtask1\n | task2"
var lineParts: string[] = []
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

    return project
}

function parseTask(i: number): ITask {
    if (lines[i].match(/^\|\S\|/)) {
        lineParts = lines[i].split('|')
    }
    else if (lines[i].match(/^\s-[\S]/)) {
        subTasks.push(lines[i])
    }
    else {
        return null
    }

    var subTasks: string[] = []
    const task: ITask = {
        name: lineParts[1],
        status: lineParts[2],
        priority: lineParts[3] as Priority,
        category: lineParts[4],
        subtasks: [],
        notes: ""
    }
    return task
}