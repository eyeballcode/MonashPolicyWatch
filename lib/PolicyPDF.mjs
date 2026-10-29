import { PDFParse } from "pdf-parse"
import { createHash } from 'crypto'
import { createPatch } from "diff"

export class PolicyPDF {

    #data
    #text
    #procedureName

    constructor(data, procedureName) {
        this.#data = data
        this.#procedureName = procedureName
    }

    async getText() {
        if (this.#text) return this.#text
        const parser = new PDFParse({ data: this.#data })
        const text = await parser.getText()

        this.#text = text.pages.map(page => page.text.replace(/[ \w]+ Procedure \| \d+/, '')).join('\n').replace(/\n+/g, '\n')

        return this.#text
    }

    getHash() {
        return createHash('sha256').update(this.#data).digest('hex')
    }

    isEqual(otherPDF) {
        return otherPDF.getHash() === this.getHash()
    }

    async getVersionName() {
        return (await this.getText())
            .split('\n')
            .slice(-10)
            .find(line => line.startsWith('Version'))
            .match(/Version\s+(\d+\.\d+)/)[1]
    }

    async getProcedureName() {
        return this.#procedureName
    }

    async diff(otherPDF) {
        const currentText = await this.getText()
        const otherText = await otherPDF.getText()
        return createPatch(
            await this.getProcedureName(), currentText, otherText,
            'v' + await this.getVersionName(),
            'v' + await otherPDF.getVersionName()
        ).replaceAll(/^(@.+@)$/gm, '\n$1')
    }

}