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

    tasks: Todo[] = []
    pendingTasks: Todo[] = []
    doneTasks: Todo[] = []

    constructor(private taskStorage: TaskStorage) {

    }
    getTasks() {
        this.orderAlphabetically(this.pendingTasks)
        this.orderAlphabetically(this.doneTasks)
        const orderedTasks = [...this.pendingTasks, ...this.doneTasks]
        return orderedTasks
    }
    addTask(newTask: string) {
        const taskObj: Todo = { title: newTask, status: 'pending' }
        this.tasks.push(taskObj)
        this.pendingTasks.push(taskObj)
        this.orderAlphabetically(this.tasks)

    }
    /*orderTasks(){ 
    this.tasks.sort( (a :Todo,b :Todo) => a.title.localeCompare(b.title))
    }*/

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
    }
    getDoneList() {
        return this.doneTasks
    }
    async loadTasks() {
        this.tasks = await this.taskStorage.loadTasks()
        this.tasks.forEach(task => {
            if (task.status === "pending") {
                this.pendingTasks.push(task)
            }
            else if (task.status === "done") this.doneTasks.push(task)
        })
    }
    saveTasks() {
        this.taskStorage.saveTasks(this.tasks)
    }
}


