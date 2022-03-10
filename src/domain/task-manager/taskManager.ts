export const hello = () => {
    return 'hello'
}

let memoryStorage: string

interface Todo { title: string, status: string }

interface TaskStorage {

    loadTasks(): Promise<Todo[]>

    saveTasks(todos: Todo[]): void

}

export class InMemoryTaskStorage implements TaskStorage {
    
    async loadTasks(): Promise<Todo[]> {
        let memoryDecoded: Todo[] = JSON.parse(memoryStorage)
        return memoryDecoded
    }

    saveTasks(todos: Todo[]): void {
        memoryStorage = JSON.stringify(todos)
    }
}

export class App {

    pendingTasks: Todo[] = []
    doneTasks: Todo[] = []

    constructor(private taskStorage: TaskStorage) {

    }
    
    getTasks() {
        const orderedTasks = [...this.pendingTasks, ...this.doneTasks]
        return orderedTasks
    }

    addTask(newTask: string) {
        const taskObj: Todo = { title: newTask, status: 'pending' }
        this.pendingTasks.push(taskObj)
        this.orderAlphabetically(this.pendingTasks)
    }

    orderAlphabetically(ArrayToOrder: Todo[]) {
        ArrayToOrder.sort((a: Todo, b: Todo) => a.title.localeCompare(b.title))
    }

    getPendingTasks() {
        return this.pendingTasks
    }

    moveDoneTask(doneTaskTitle: string) {
        const taskToMoveIndex: number = this.pendingTasks.findIndex(task => task.title === doneTaskTitle)
        this.pendingTasks[taskToMoveIndex].status = 'done'
        this.doneTasks.push(this.pendingTasks[taskToMoveIndex])
        this.pendingTasks.splice(taskToMoveIndex, 1)
        this.orderAlphabetically(this.doneTasks)
    }

    getDoneTasks() {
        return this.doneTasks
    }

    async loadTasks() {
        let tasks = await this.taskStorage.loadTasks()
        tasks.forEach(task => {
            if (task.status === "pending") {
                this.pendingTasks.push(task)
            }
            else if (task.status === "done") this.doneTasks.push(task)
        })
    }

    saveTasks() {
        let tasks = [...this.pendingTasks , ...this.doneTasks]
        this.taskStorage.saveTasks(tasks)
    }
}


