# What is this?
It's a [Angular](https://angular.io/) Web Extension **boilerplate** for [Mozilla Firefox](https://www.mozilla.org/ru/firefox/).
You can build all parts of an extension with **Angular** by using the boilerplate.

**Note.** [Content script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts) has no a `html` page so it is a simple TypeScript code.

# Build
**Build** all parts of the extension
```sh
npm run build
```

Build all parts of the extension and **watch** (auto update the extension on code is changed)
```sh
npm run watch
```

Build all parts of the extension for a **production** 
```sh
npm run prod
```

# Build separately

To build **separately** for a **development** with code [source map](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) use commands
```sh
npm run build:ba
npm run build:bg
npm run build:co
npm run build:op
npm run build:pa
npm run build:sb
npm run build:dp
npm run build:nt
npm run build:dpanel
```
To build for a **development** and **auto update** compiled code use commands
```sh
npm run watch:ba
npm run watch:bg
npm run watch:co
npm run watch:op
npm run watch:pa
npm run watch:sb
npm run watch:dp
npm run watch:nt
npm run watch:dpanel
```
To build for a **production** use commands
```sh
npm run prod:ba
npm run prod:bg
npm run prod:co
npm run prod:op
npm run prod:pa
npm run prod:sb
npm run prod:dp
npm run prod:nt
npm run prod:dpanel
```
To update `manifest.json` file use commands
```sh
npm run copy-manifest
```

# Abbreviations

* **ba** means [browser action](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_actions)
* **bg** means [background script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts)
* **co** means [content scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)
* **op** means [options page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Implement_a_settings_page)
* **pa** means [page action](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/pageAction)
* **sb** means [sidebar page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars)
* **dp** means [devtools page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Extending_the_developer_tools) (It's not a **devtool panel** that should be created manually. It's a initial page.)
* **nt** means [new tab page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/chrome_url_overrides)
* **dpanel** means [devtools page panel](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Extending_the_developer_tools). You can create as many **devtool page panel**s as you wish.

**Note.** Also it is possible to override **bookmarks page** and **history page** pages for **Google Chrome** but it is not supported by **Mozilla Firefox** yet. See [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Extending_the_developer_tools).

# How to add a new devtool page panel
You can create as many [devtools page panel](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Extending_the_developer_tools) as you wish. Do not forget to create the panel in **dp-app** project with [devtools.panels.create()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/devtools.panels/create).

**Firstly** generate a new panel. Where `X` is any unique string. And switch on a `template` and `style` files generation.
```
ng g application dpanelX-app --style=scss --routing --minimal
ng config projects.dpanelX-app.schematics.@schematics/angular:component.inlineTemplate false
ng config projects.dpanelX-app.schematics.@schematics/angular:component.inlineStyle false
```
**Secondly** add commands to `package.json` project file to the `"scripts": { ...` section.
```
"build:dpanelX": "ng build dpanelX-app --base-href ./",
"watch:dpanelX": "ng build dpanelX-app --base-href ./ --watch",
"prod:dpanelX": "ng build dpanelX-app --source-map=false --outputHashing=none --base-href ./ --prod",
```

# Third party dependencies
* [npm-run-all](https://github.com/mysticatea/npm-run-all) - to run build in parallel mode
* [fs-extra](https://github.com/jprichardson/node-fs-extra) - to copy `manifest.json`

# TODO
1. Use [angular-builders](https://github.com/just-jeb/angular-builders) to compile `dp-app/src/assets/devtools-page` code and add TypeScript support.
2. Create common root `assets` directory. It can be made as a **assets-lib** library with modified `assets : { ...` section in `angular.json` file.
3. Reduce `bg-app` and `dp-app` by switching off `index.html` dynamic building with `AppComponent` (see `co-app` as an example).
