import { App, hello, InMemoryTaskStorage } from "./taskManager"

describe('task management' , () => { 

    it('return hello ' , () => { 
        expect(hello()).toMatch('hello')
    })
    it( 'the task list is empty' , () => {
        const app = new App(new InMemoryTaskStorage())
        expect(app.getTasks()).toHaveLength(0)
    })
    it ('add task in taskList' ,() => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('tondre')
        expect(app.getTasks()[0]).toEqual({title :'tondre' ,status :'pending'})
    })
    it ('add two task in taskList' , () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('cuisiner')
        app.addTask('tondre')
        expect(app.getTasks()[0]).toEqual({title :'cuisiner',status :'pending'})
        expect(app.getTasks()[1]).toEqual({title :'tondre',status :'pending'})
    })
    it ('taskList ordered in alphabetical order' , () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('tondre')
        app.addTask('cuisiner')
        expect(app.getTasks()[0]).toEqual({title :'cuisiner',status :'pending'})
        expect(app.getTasks()[1]).toEqual({title :'tondre',status :'pending'})
    })
    it ('add new task to pending list' , () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('tondre') 
        expect(app.getPendingTasks()[0]).toEqual({title :'tondre',status :'pending'})  
    })
    
    it ('move task in doneList' , () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('tondre') 
        app.moveDoneTask('tondre')
        expect(app.getDoneList()[0]).toEqual({title :'tondre',status :'done'})  
    })
    it ('done task is not on pending list' , () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('vikking') 
        app.addTask('tondre')
        app.moveDoneTask('tondre')
        expect(app.getPendingTasks()[0].title).toMatch('vikking') 
    })
    it ('getTasks return tasks status + title' , () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('vikking') 
        expect(app.getTasks()[0].status).toMatch('pending') 
    })
    it ('getTasks() is ordered by pending first ,done after and ordered alphabeticaly' ,() => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('vikking') 
        app.addTask('snapping') 
        app.addTask('ridding') 
        app.addTask('kiking') 
        app.moveDoneTask('snapping')
        app.moveDoneTask('ridding')
        expect(app.getTasks()).toEqual([{title :'kiking',status :'pending'},{title :'vikking',status :'pending'},{title :'ridding',status :'done'},{title :'snapping',status :'done'}])
    } )
    it ('can save the todo' , async () => {
        const app = new App(new InMemoryTaskStorage())
        app.addTask('tondre')
        app.saveTasks() 
        const newApp = new App(new InMemoryTaskStorage())
        await newApp.loadTasks()
        expect(newApp.getPendingTasks()[0]).toEqual({title :'tondre',status :'pending'})  
    })
    it ('memorized data are corectly sorted by status and alphabeticaly ', async () => { 
        const app = new App(new InMemoryTaskStorage())
        app.addTask('vikking') 
        app.addTask('snapping') 
        app.addTask('ridding') 
        app.addTask('kiking') 
        app.moveDoneTask('snapping')
        app.moveDoneTask('ridding')
        app.saveTasks() 
        const newApp = new App(new InMemoryTaskStorage())
        await newApp.loadTasks()
        expect(newApp.getTasks()).toEqual([{title :'kiking',status :'pending'},{title :'vikking',status :'pending'},{title :'ridding',status :'done'},{title :'snapping',status :'done'}]) 
    })
})
/*
=> move task in doneList  "V"
=> done is not on pending list "V"
=> getTask return status + task "V"
=> getTask return users one list alphetically sorted first pending and then done.... "V"

=> adapter implémentation persitence avec InMemory  alphetically
=> persistance asynchronous "V"

=> supression de l'array tasks "V" 
=> minimised sorting "V"
*/
