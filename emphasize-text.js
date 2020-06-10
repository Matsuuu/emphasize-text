const template = document.createElement('template');
template.innerHTML = `
<slot></slot>
`;

export default class EmphasizeText extends HTMLElement {
    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['emphasize', 'emphasizeClass'];
    }

    connectedCallback() {
        const words = this.getAttribute('emphasize').split(',');

        let content = this.innerHTML;
        const emphasizeClass = this.hasAttribute('emphasizeClass') ? this.getAttribute('emphasizeClass') : 'emphasize';
        const offsetLength = 22 + emphasizeClass.length; // <span class="${classname}"></span>
        words.forEach((wordToMatch) => {
            const regex = new RegExp(wordToMatch, 'g');
            let match;
            while ((match = regex.exec(content)) !== null) {
                const isHtmlTag = this.isMatchHtmlTag(content, match);
                // You might have some html tags inside your content. We don't want to parse these
                if (isHtmlTag) {
                    continue;
                }
                content = `${content.substring(0, match.index)}<span class="${emphasizeClass}">${
                    match[0]
                }</span>${content.substring(match.index + match[0].length)}`;
                regex.lastIndex += offsetLength;
            }
        });
        this.innerHTML = content;
    }

    /** This is a fairly naive way of doing this but it works for now */
    isMatchHtmlTag(content, match) {
        const charsBefore = content.substring(match.index - 2, match.index);
        return charsBefore === '</' || charsBefore.substring(1, 2) === '<';
    }
}

if (!customElements.get('emphasize-text')) {
    customElements.define('emphasize-text', EmphasizeText);
}
