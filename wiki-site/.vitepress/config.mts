import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
    defineConfig({
        title: "VNNotes",
        description: "The Ultimate Partner for Meetings & Interviews",
        appearance: 'dark', // Enforce dark theme
        themeConfig: {
            nav: [
                { text: 'Home', link: '/' },
                { text: 'Architecture Guide', link: '/vnnotes_architecture' }
            ],

            sidebar: [
                {
                    text: 'Documentation',
                    items: [
                        { text: 'Architecture Guide', link: '/vnnotes_architecture' }
                    ]
                }
            ],

            socialLinks: [
                { icon: 'github', link: 'https://github.com/bbqqvv/VNNotes-AnonymNotes' }
            ]
        },
        // Mermaid dark theme variables as required by the wiki-vitepress skill
        mermaid: {
            theme: 'dark',
            themeVariables: {
                primaryColor: '#1e3a5f',
                primaryTextColor: '#e0e0e0',
                primaryBorderColor: '#4a9eed',
                lineColor: '#4a9eed',
                secondaryColor: '#2d4a3e',
                tertiaryColor: '#2d2d3d',
                background: '#1a1a2e',
                mainBkg: '#1e3a5f',
                nodeBorder: '#4a9eed',
                clusterBkg: '#16213e',
                titleColor: '#e0e0e0',
                edgeLabelBackground: '#1a1a2e'
            }
        }
    })
)
