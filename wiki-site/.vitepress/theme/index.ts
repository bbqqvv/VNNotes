import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import './custom.css'

export default {
    ...DefaultTheme,
    setup() {
        onMounted(() => {
            // 1. Mermaid Inline Style Fix (Polling because mermaid renders async)
            let attempts = 0
            const fix = setInterval(() => {
                const svgElements = document.querySelectorAll('.mermaid svg [style]')

                if (svgElements.length > 0) {
                    svgElements.forEach(el => {
                        const s = (el as HTMLElement).style
                        if (s.fill && !s.fill.includes('#1e3a5f')) s.fill = '#1e3a5f'
                        if (s.stroke && !s.stroke.includes('#4a9eed')) s.stroke = '#4a9eed'
                        if (s.color) s.color = '#e0e0e0'
                    })
                }

                // 2. Click to Zoom Setup
                const mermaidContainers = document.querySelectorAll('.mermaid')
                if (mermaidContainers.length > 0) {
                    mermaidContainers.forEach(el => {
                        // Avoid duplicate listeners
                        if ((el as any)._hasZoomListener) return
                        (el as any)._hasZoomListener = true

                        const htmlEl = el as HTMLElement;
                        htmlEl.style.cursor = 'zoom-in'
                        htmlEl.addEventListener('click', () => {
                            const modal = document.createElement('div')
                            modal.className = 'mermaid-zoom-modal'
                            modal.innerHTML = htmlEl.outerHTML
                            modal.addEventListener('click', () => modal.remove())
                            document.body.appendChild(modal)
                        })
                    })
                }

                if (++attempts >= 20) clearInterval(fix)
            }, 500)
        })
    }
}
