import * as ABPFilterParser from 'abp-filter-parser'

export const Parser = function () {
  this.ABPfilters = {}

  // Map webRequest resourceTypes to ABP types
  const elementTypes = {
    script: ABPFilterParser.elementTypes.SCRIPT,
    image: ABPFilterParser.elementTypes.IMAGE,
    stylesheet: ABPFilterParser.elementTypes.STYLESHEET,
    object: ABPFilterParser.elementTypes.OBJECT,
    xmlhttprequest: ABPFilterParser.elementTypes.XMLHTTPREQUEST,
    object_subrequest: ABPFilterParser.elementTypes.OBJECTSUBREQUEST,
    main_frame: ABPFilterParser.elementTypes.DOCUMENT,
    sub_frame: ABPFilterParser.elementTypes.SUBDOCUMENT,
    other: ABPFilterParser.elementTypes.OTHER
  }

  /*
    Parses AdBlockPlus filter rules and converts them to match patterns.
    @param filterContent { String } - a newline-delimited text string
    @return {Object} { rules: Array<String>, exceptions: Array<String }
  */
  const parseRules = (filterContent) => {
    ABPFilterParser.parse(filterContent, this.ABPfilters)
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
