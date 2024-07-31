export class ComponentSyntaxCompiler {

    enum TokenType {
        HtmlContent = 'HtmlContent',
        ScriptStart = 'ScriptStart',
        ScriptEnd = 'ScriptEnd',
        ScriptText = 'ScriptText',
        StyleStart = 'StyleStart',
        StyleEnd = 'StyleEnd',
        StyleText = 'StyleText',
        ScriptTag = 'ScriptTag',
        StyleTag = 'StyleTag',
        ContentTag = 'ContentTag',
    }

    interface ScriptStyleContentToken {
        type: TokenType;
        value: string;
        source: string;
    }

    function compile(sourceCode: string): { type: TokenType; value: string }[] {
        const tokens: { type: TokenType; value: string }[] = [];

        const scriptMatch = sourceCode.match(/script:\s*\n*([\s\S]*?)(?=style:|content:|$)/);
        if (scriptMatch) {
            const scriptMatchString = scriptMatch[0].slice(0, 7);
            const scriptText = scriptMatch[1].trim();
            tokens.push({ type: TokenType.ScriptTag, value: scriptMatchString });
            tokens.push({ type: TokenType.ScriptText, value: scriptText });
        }

        const styleMatch = sourceCode.match(/style:\s*\n*([\s\S]*?)(?=script:|content:|$)/);
        if (styleMatch) {
            const styleMatchString = styleMatch[0].slice(0, 6);
            const styleText = styleMatch[1].trim();
            tokens.push({ type: TokenType.StyleTag, value: styleMatchString });
            tokens.push({ type: TokenType.StyleText, value: styleText });
        }

        const contentMatch = sourceCode.match(/content:\s*\n*([\s\S]*?)(?=script:|style:|$)/);
        if (contentMatch) {
            const contentMatchString = contentMatch[0].slice(0, 8);
            const contentContent = contentMatch[1].trim();
            tokens.push({ type: TokenType.ContentTag, value: contentMatchString });
            tokens.push({ type: TokenType.HtmlContent, value: contentContent });
        }

        return tokens;
    }

    class ScriptParser {
        private scriptTag: string;

        constructor(scriptTag: string) {
            this.scriptTag = scriptTag;
        }

        public parseScript(): void {
            const errors: string[] = [];

            if (!this.scriptTag.trim().endsWith(':')) {
                errors.push(`Script component '${this.scriptTag}' should be followed by a colon (:) e.g. \n script: \n . If you've added a colon : to your script declaration and still encounter this error, it indicates that your script declaration might not be spelled correctly or is not written in lowercase. e.g. script: `);
            }

            const scriptTagWithoutColon = this.scriptTag.replace(':', '');
            if (scriptTagWithoutColon !== 'script') {
                errors.push(`Script tag should be lowercase (script:).`);
            }

            const lines = this.scriptTag.trim().split('\n');

            if (lines.length > 1) {
                errors.push('Error: script: component must be on its own line without any other elements before or after it. e.g. \n script: \n');
            }

            for (let i = 0; i < lines.length - 1; i++) {
                const currentLine = lines[i].trim();
                const nextLine = lines[i + 1].trim();
                if (currentLine.startsWith('script:') && (nextLine.startsWith('style:') || nextLine.startsWith('content:'))) {
                    if (!nextLine.startsWith('\n')) {
                        errors.push('Error: There must be at least one newline between script: and style: or content: declarations.');
                        break;
                    }
                }
            }

            if (errors.length > 0) {
                errors.forEach(error => console.error(`Error: ${error}`));
                return;
            }

            console.log('Semantic analysis and further validation of script tag.');
            console.log('Script tag parsed successfully.');
        }
    }

    function validateScriptTokens(tokens: { type: TokenType; value: string }[]): void {
        let scriptTag = '';

        for (const token of tokens) {
            if (token.type === TokenType.ScriptTag) {
                scriptTag = token.value;
                break;
            }
        }

        const scriptParser = new ScriptParser(scriptTag);
        scriptParser.parseScript();
    }

    class StyleParser {
        private styleTag: string;

        constructor(styleTag: string) {
            this.styleTag = styleTag;
        }

        public parseStyle(): void {
            const errors: string[] = [];

            if (!this.styleTag.trim().endsWith(':')) {
                errors.push(`Style component '${this.styleTag}' should be followed by a colon (:) e.g. \n style: \n . If you've added a colon : to your style declaration and still encounter this error, it indicates that your style declaration might not be spelled correctly or is not written in lowercase. e.g. style: `);
            }

            const styleTagWithoutColon = this.styleTag.replace(':', '');
            if (styleTagWithoutColon !== 'style') {
                errors.push(`Style tag should be lowercase (style:).`);
            }

            const lines = this.styleTag.trim().split('\n');

            if (lines.length > 1) {
                errors.push('Error: style: component must be on its own line without any other elements before or after it. e.g. \n style: \n');
            }

            for (let i = 0; i < lines.length - 1; i++) {
                const currentLine = lines[i].trim();
                const nextLine = lines[i + 1].trim();
                if (currentLine.startsWith('style:') && (nextLine.startsWith('script:') || nextLine.startsWith('content:'))) {
                    if (!nextLine.startsWith('\n')) {
                        errors.push('Error: There must be at least one newline between style: and script: or content: declarations.');
                        break;
                    }
                }
            }

            if (errors.length > 0) {
                errors.forEach(error => console.error(`Error: ${error}`));
                return;
            }

            console.log('Semantic analysis and further validation of style tag.');
            console.log('Style tag parsed successfully.');
        }
    }

    function validateStyleTokens(tokens: { type: TokenType; value: string }[]): void {
        let styleTag = '';

        for (const token of tokens) {
            if (token.type === TokenType.StyleTag) {
                styleTag = token.value;
                break;
            }
        }

        const styleParser = new StyleParser(styleTag);
        styleParser.parseStyle();
    }

    class ContentParser {
        private contentTag: string;

        constructor(contentTag: string) {
            this.contentTag = contentTag;
        }

        public parseContent(): void {
            const errors: string[] = [];

            if (!this.contentTag.trim().endsWith(':')) {
                errors.push(`Content component '${this.contentTag}' should be followed by a colon (:) e.g. \n content: \n . If you've added a colon : to your content declaration and still encounter this error, it indicates that your content declaration might not be spelled correctly or is not written in lowercase. e.g. content: `);
            }

            const contentTagWithoutColon = this.contentTag.replace(':', '');
            if (contentTagWithoutColon !== 'content') {
                errors.push(`Content tag should be lowercase (content:).`);
            }

            const lines = this.contentTag.trim().split('\n');

            if (lines.length > 1) {
                errors.push('Error: content: component must be on its own line without any other elements before or after it. e.g. \n content: \n');
            }

            for (let i = 0; i < lines.length - 1; i++) {
                const currentLine = lines[i].trim();
                const nextLine = lines[i + 1].trim();
                if (currentLine.startsWith('content:') && (nextLine.startsWith('script:') || nextLine.startsWith('style:'))) {
                    if (!nextLine.startsWith('\n')) {
                        errors.push('Error: There must be at least one newline between content: and script: or style: declarations.');
                        break;
                    }
                }
            }

            if (errors.length > 0) {
                errors.forEach(error => console.error(`Error: ${error}`));
                return;
            }

            console.log('Semantic analysis and further validation of content tag.');
            console.log('Content tag parsed successfully.');
        }
    }

    function validateContentTokens(tokens: { type: TokenType; value: string }[]): void {
        let contentTag = '';

        for (const token of tokens) {
            if (token.type === TokenType.ContentTag) {
                contentTag = token.value;
                break;
            }
        }

        const contentParser = new ContentParser(contentTag);
        contentParser.parseContent();
    }

    function generateHTML(tokens: { type: TokenType; value: string }[]): string {
        let htmlCode = '';

        for (const token of tokens) {
            switch (token.type) {
                case TokenType.ScriptTag:
                    htmlCode += '<script>\n';
                    break;
                case TokenType.ScriptText:
                    htmlCode += token.value + '\n';
                    htmlCode += '</script>\n';
                    break;
                case TokenType.StyleTag:
                    htmlCode += '<style>\n';
                    break;
                case TokenType.StyleText:
                    htmlCode += token.value + '\n';
                    htmlCode += '</style>\n';
                    break;
                case TokenType.HtmlContent:
                    htmlCode += token.value + '\n';
                    break;
                default:
                    break;
            }
        }

        return htmlCode;
    }

}
