import { PDFParse } from "pdf-parse"
import { createHash } from 'crypto'

export class PolicyPDF {

    #data

    constructor(data) {
        this.#data = data
    }

    async getText() {
        const parser = new PDFParse({ data: this.#data })
        const text = await parser.getText()
        return text.pages.map(page => page.text.replace(/[ \w]+ Procedure \| \d+/, '')).join('\n').replace(/\n+/g, '\n')
    }

    getHash() {
        return createHash('sha256').update(this.#data).digest('hex')
    }

}