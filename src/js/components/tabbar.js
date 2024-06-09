const templateTabbar = (logoutConst) => {
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
            <a href="" @click="${logoutConst}" class="tab-link">
                <i class="f7-icons blue">arrow_right_circle</i>
                <span class="tabbar-label">Déconnexion</span>
            </a>
        </div>
    `
}

const loadTabbar = (idSelector, logoutConst) => {
    const selectorTemplate = document.querySelector(`#${idSelector}`); 
    if (selectorTemplate) {
        const tempElement = document.createElement('div')
        tempElement.className = 'toolbar tabbar tabbar-icons toolbar-bottom'
        tempElement.innerHTML = templateTabbar(logoutConst)
    
        selectorTemplate.appendChild(tempElement)
    }
}

export { loadTabbar }
