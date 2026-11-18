import { load } from 'cheerio'
import { createPatch } from 'diff'

export default class MonashWebpage {

    #htmlData
    #text
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
        this.#$('.accTitle__icon').remove()
        this.#$('script').remove()
        this.#$('style').remove()
        this.#$('link').remove()
    }

    getText() {
        if (this.#text) return this.#text

        const content = this.#$('.content')

        content.find('br').replaceWith('\n')
        content.find('h1, h2, h3, h4, h5, h6').before('\n')
        content.find('h1, h2, h3, h4, h5, h6').after('\n\n')

        content.find('td, th').after('\t')
        content.find('thead, tr').after('\n')

        content.find('p, div').after('\n')
        content.find('li:not(.graphite-accordion__item)').before('* ').after('\n')
        content.find('ul').after('\n')

        this.#text = content.text().trim().replaceAll(/^\s+$/gm, '').replaceAll(/\n\n\n+/g, '\n\n').split('\n').map(line => line.trim()).join('\n')
        return this.#text
    }

    getWebpageName() {
        return this.#$('title').text()
    }

    getVersionName() {
        return this.#$('#ftr > div > div.ftr__legal > section:nth-child(4) > div > p').text().trim().split('Last updated: ').pop()
    }

    async diff(otherVersion) {
        const currentText = await this.getText()
        const otherText = await otherVersion.getText()
        return createPatch(
            this.getWebpageName(), currentText, otherText,
            'v' + this.getVersionName(),
            'v' + otherVersion.getVersionName()
        ).replaceAll(/^(@.+@)$/gm, '\n$1')
    }

}