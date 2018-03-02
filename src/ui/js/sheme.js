const schema = {
    type: 'object',
    properties: {
        engines: {
            type: 'array',
            title: "Page number",
            description: 'Page number',
            items: {
                description: 'Add Page number',
                type: 'object',
                properties: {
                    _name: {
                        type: 'string',
                        title: '_name'
                    },
                    _shortName: {
                        type: 'string',
                        title: '_shortName'
                    },
                    description: {
                        type: 'string',
                        title: 'description'
                    },
                    queryCharset: {
                        type: 'string',
                        title: 'queryCharset'
                    },
                    __searchForm: {
                        type: 'string',
                        title: '__searchForm'
                    },
                    _iconURL: {
                        type: 'string',
                        title: '_iconURL'
                    },
                    _readOnly: {
                        type: 'boolean',
                        title: '_readOnly',
                        default: 'false',
                    },
                    _loadPath: {
                        type: 'string',
                        title: '_loadPath'
                    },
                    _metaData: {
                        type: 'object',
                        properties: {
                            alias: {
                                type: 'string',
                                title: 'alias'
                            }
                        }
                    },
                    _urls: {
                        type: 'array',
                        title: '_urls',
                        items: {
                            description: '_urls',
                            type: 'object',
                            properties: {
                                template: {
                                    type: 'string',
                                    title: 'template',
                                    description: 'template'
                                },
                                resultDomain: {
                                    type: 'string',
                                    title: 'resultDomain',
                                    description: 'resultDomain'
                                },
                                params: {
                                    type: 'array',
                                    title: 'params',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string',
                                                title: 'name'
                                            },
                                            value: {
                                                type: 'string',
                                                title: 'value'
                                            }
                                        }
                                    }
                                },
                                rels: {
                                    type: 'array',
                                    title: 'rels',
                                    items: {}
                                }
                            }
                        }
                    }
                }
            }
        },
        visibleDefaultEngines: {}
    }
};