import { logout } from '../../js/token.js'

const templateTabbar = (selector) => {
    return `
        <div class="toolbar-inner">
            <a href="/calendar/" class="tab-link">
                <i class="f7-icons">calendar</i>
                <span class="tabbar-label">Calendrier</span>
            </a>
            <a href="/prestation/" class="tab-link tab-link-active">
                <i class="material-icons">home</i>
                <span class="tabbar-label">Prestations</span>
            </a>
            <a href="" id="logout-link-${selector}" class="tab-link">
                <i class="f7-icons blue">arrow_right_circle</i>
                <span class="tabbar-label">Déconnexion</span>
            </a>
        </div>
    `
}

const loadTabbar = (idSelector, $f7) => {
    const selectorTemplate = document.querySelector(`#${idSelector}`)
    
    if (selectorTemplate) {
        const tempElement = document.createElement('div')
        tempElement.className = 'toolbar tabbar tabbar-icons toolbar-bottom'
        tempElement.innerHTML = templateTabbar(idSelector)
    
        selectorTemplate.appendChild(tempElement)
        const logoutLink = document.getElementById(`logout-link-${idSelector}`)
        logoutLink.addEventListener('click', () => logout($f7))
    }
}

export { loadTabbar }
