import { load } from 'cheerio'

export default class MonashWebpage {

    #htmlData
    #$

    constructor({ data }) {
        this.#htmlData = data
        this.#$ = load(data)
        this.#setup()
    }

    #setup() {
        this.#$('#breadcrumbs').remove()
        this.#$('#monash-faq-help-panel').remove()
        this.#$('.hidden').remove()
        this.#$('.accTitle__toggle-wrapper').remove()
        this.#$('script').remove()
        this.#$('style').remove()
        this.#$('link').remove()
    }

    getText() {
        const content = this.#$('.content')
        
        content.find('br').replaceWith('\n')
        content.find('h1, h2, h3, h4, h5, h6').before('\n')
        content.find('h1, h2, h3, h4, h5, h6').after('\n\n')

        content.find('p, div').after('\n')
        content.find('li').before('* ').after('\n')
        content.find('ul').after('\n')

        return content.text().trim().replaceAll(/^\s+$/gm, '').replaceAll(/\n\n\n+/g, '\n\n')
    }

}