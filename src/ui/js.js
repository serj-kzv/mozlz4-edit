let schema = {
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
                        items: {
                            type: 'object',
                            properties: {
                                params: {
                                    type: 'array',
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
                                    items: {
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
let engines = {};

document.addEventListener("DOMContentLoaded", function (event) {
    const button = document.querySelector('#selectMozlz4FileButton');

    const saveBtn = document.querySelector('#save');

    saveBtn.addEventListener('click', function (event) {
        const enginesStr = JSON.stringify(engines);
        var fs = require('fs');
        var lz4 = require('lz4');
        var output = lz4.encode(enginesStr);
    });

    button.onchange = function onButtonPress(ev) {
        let file = ev.target.files[0];

        readMozlz4File(file, function (text) {
            engines = JSON.parse(text);

            console.log(engines);

            createForm(schema, engines);
        });
    };
});

function createForm(schema, engines) {
    const BrutusinForms = brutusin["json-forms"];
    const bf = BrutusinForms.create(schema);
    const container = document.getElementById('container');

    bf.render(container, engines);
}