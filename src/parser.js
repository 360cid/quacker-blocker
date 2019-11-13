import * as ABPFilterParser from 'abp-filter-parser'

export const Parser = function () {
    this.useABP = true
    this.ABPfilters = {}

    // Map webRequest resourceTypes to ABP types
    const elementTypes = {
        'script': ABPFilterParser.elementTypes.SCRIPT,
        'image': ABPFilterParser.elementTypes.IMAGE,
        'stylesheet': ABPFilterParser.elementTypes.STYLESHEET,
        'object': ABPFilterParser.elementTypes.OBJECT,
        'xmlhttprequest': ABPFilterParser.elementTypes.XMLHTTPREQUEST,
        'object_subrequest': ABPFilterParser.elementTypes.OBJECTSUBREQUEST,
        'main_frame': ABPFilterParser.elementTypes.DOCUMENT,
        'sub_frame': ABPFilterParser.elementTypes.SUBDOCUMENT,
        'other': ABPFilterParser.elementTypes.OTHER
    }
      
    // Map ABP types to webRequest resourceTypes
    const types = [
        'script',
        'image',
        'stylesheet',
        'object',
        'subdocument',
        'xmlhttprequest',
        'websocket',
        'webrtc',
        'popup',
        'generichide', // TODO: might be unnecessary
        'genericblock'
    ]

    const resourceTypes = [
        'beacon',
        'csp_report',
        'font',
        'image',
        'imageset',
        'main_frame',
        'media',
        'object',
        'object_subrequest',
        'ping',
        'script',
        'speculative',
        'stylesheet',
        'sub_frame',
        'web_manifest',
        'websocket',
        'xbl',
        'xml_dtd',
        'xmlhttprequest',
        'xslt',
        'other'
    ]

    // TODO: write tests around these formatting functions
    // Test whether the string is a valid rule (i.e. not a comment, element, or ABP version)
    function isValidRule (testString) {
        if (/^!|#{2}|Adblock Plus/.test(testString)) {
            return false
        }
        return true
    }

    // Test whether the string is an exception rule
    function isException (ruleString) {
        return /^@{2}/.test(ruleString)
    }

    // TODO: Catch if a filter cannot be parsed and log it to console.
    function formatRule (ruleString) {
        // abp rules:
        // /{term}/ - matches {term} verbatim
        // * - wildcard
        // ^ - separator (?,:,/)
        // ||{domain}^ - matches domain name
        // |{address}| - matches exact address

        // match pattern:
        // <scheme>://<host><path>
        // 
        const tokens = {
            scheme: '*://', // TODO: this only matches http(s) (and websocket URLs in firefox only)
            host: '*',
            path: '/*'
        }
        // Check for host
        const domain = /^\|{2}(?<domain>.*)\^$/
        const isDomainOrAddress = /^\|((\|(?<domain>.*)\^$)|(?<address>.*)\|$)/
        return ruleString
    }

    function formatException (ruleString) {
        return ruleString.slice(2)
    }
    
    const _parseInternal = (filterContent) => {                     
        // Split the string at /n
        // For each split string, determine whether it's a rule, exception, element, or comment
        // If not a comment or element, replace ABP tokens with RegEx tokens
        // Add the converted string to the rules or exceptions array
        // TODO: what about zoidberg/file types exceptions?
        const lines = filterContent.split('\n')
        const len = lines.length
        let rules = []
        let exceptions = []
        //console.log('lines', lines)
        for (let i = 0; i < len; i++) {
            if (isValidRule(lines[i])) {
                if (isException(lines[i])) {
                    const rule = formatException(lines[i])
                    exceptions.push(rule)
                } else {
                    const rule = formatRule(lines[i])
                    rules.push(rule)
                }
            }
        }
            
        console.log('result', rules, exceptions)
        return {
            rules,
            exceptions
        }
    }

    /*
        Parses AdBlockPlus filter rules and converts them to match patterns.
        @param filterContent { String } - a newline-delimited text string
        @return {Object} { rules: Array<String>, exceptions: Array<String }
    */
    const parseRules = (filterContent) => {
        if (!this.useABP) {
            this._parseInternal(filterContent)  
        }
        // The original plan was to write our own parser, but in the interest
        // of time, we're going to be using ABPFilterParser to get up and running.
        // The ABP ruleset is pretty complex and doesn't translate exactly to 
        // webRequest match rules.
        ABPFilterParser.parse(filterContent, this.ABPfilters)
        console.log(this.ABPfilters)
    }

    /*
        Given a URL, determine whether it should be blocked or not.
        @param urlString {string} - the URL to test against
        @param currentDomain {string} - the name of the current domain, e.g. news.ycombinator.com
        @return bool
    */
    const shouldBlockUrl = (urlString, currentDomain, fileType) => {
        return ABPFilterParser.matches(this.ABPfilters, urlString, {
            domain: currentDomain,
            elementTypeMaskMap: elementTypes[fileType] || elementTypes.other
        })
    }

    return {
        parseRules,
        shouldBlockUrl
    }
}
