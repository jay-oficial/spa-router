const getContent = async(route,root) =>{
    const response = await fetch(route)
    const content = await response.text()
    const html = document.createElement('section')
    html.innerHTML =  content
    root.innerHTML=content
}

const router = (routes,actualRoute,root) =>{
    routes.forEach(route=>{
        if (route.path===actualRoute){
            getContent(route.template,root)
        }
    })
}

class Router extends HTMLElement{
    connectedCallback(){
        const root = document.querySelector(`#${this.getAttribute('root')}`)
        const routes = []
        this.querySelectorAll('[route]').forEach(routeItem=>{
            const route = {}
            route.path = routeItem.getAttribute('route')
            route.template = routeItem.getAttribute('content')
            routes.push(route)
        })

        this.addEventListener('click',(e)=>{
            e.preventDefault()
            let item = e.target
            if (item.getAttribute('route')){
                window.location.hash = item.getAttribute('route')
            }
        })
        
        window.addEventListener('load',()=>{
            const path = window.location.pathname
            const hash = window.location.hash.replace('#','')
            if (!hash){
                router(routes,path,root)
            }else{
                router(routes,hash,root)
            }
        })
            
            window.addEventListener('hashchange',()=>{
                router(routes,window.location.hash.replace('#',''),root)
            })
    }
}

customElements.define('hash-router',Router)
