type Priority = "low" | "high" | "urgent"

type Status = "todo" | "in-progress" | "done" | "blocked"

type SubStatus = boolean

interface IsubTask {
    name: string
    subStatus: SubStatus
}

interface ITask {
    name: string
    status: string
    priority: Priority
    category: string
    subtasks: IsubTask[]
    notes: string
}

interface IProject {
    name: string
    tasks: ITask[]
}

interface ITaskSettings {
    taskDirectory: string
    carryOverTasks: boolean
    autoCreateFile: boolean
    deleteOldDays: boolean
    maxDays: number
    showStatus: boolean
    showCategory: boolean
    showPriority: boolean
    statusList: IStatusDefinition[]
    categories: string[]
}

interface IStatusDefinition {
    id: number
    name: string
    status: Status
}

interface IDay {
    date: string
    projects: IProject[]
}