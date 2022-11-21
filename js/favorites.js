import { GithhubUser } from "./githubUsers.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())
            if(userExists){
                throw new Error('Usuário já cadastrado.')
            }

            const user = await GithhubUser.search(username)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error){
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update() {
        let userCounter = 0
        this.removeAllTr()
        this.entries.forEach(user => {
            const row = this.createRow()
           
            userCounter++
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk){
                    this.delete(user)
                    userCounter--
                }
            }
           
            this.tbody.append(row)

            const camp = document.querySelector('.Camp')
            if(userCounter > 0){
                camp.classList.add('hide')
            }else{
                camp.classList.remove('hide')
            }
            
        })
    }
    
    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
    }


    createRow() {
        
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td class="user">
            <img src="link da imagem do usuário.png" alt="nome do usuário">
            <a href="link do github do usuário" target="_blank"> 
                <p>nome do usuário</p>
                <span>nome do usuário</span>
            </a>
            </td>
            <td class="repositories"> </td>
            <td class="followers"> </td>
            <td>
                <button class="remove">Remove</button>
        </td>
        `
       
        return tr
    }
}