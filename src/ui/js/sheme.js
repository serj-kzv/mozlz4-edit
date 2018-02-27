const schema = {
    type: 'object',
    properties: {
        engines: {
            type: 'array',
            title: "Page number",
            items: {
                type: 'object',
                properties: {
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
                    _loadPath: {
                        type: 'string',
                        title: '_loadPath'
                    },
                    _name: {
                        type: 'string',
                        title: '_name'
                    },
                    _shortName: {
                        type: 'string',
                        title: '_shortName'
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
                        title : '_urls',
                        items: {
                            type: 'object',
                            properties: {
                                params: {
                                    type: 'array',
                                    title : 'params',
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
                                    title : 'rels',
                                    items: {
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        visibleDefaultEngines : {
            type : 'array',
            title : 'visibleDefaultEngines'
            // items : {
            //     type : 'string'
            // }
        }
    }
};