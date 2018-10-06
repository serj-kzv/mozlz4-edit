##### What it's
mozlz4-edit is a text ```mozlz4``` file archiver.

##### Description

The mozlz4 is a lz4 file archive format with Mozilla's magic file header.
<br>
mozlz4 is a ```legacy``` variant of lz4 format. If you use ```liblz4-tool``` then you have to use ```-l```
flag to compress a file as the ```legacy``` lz4.

##### Dependencies

This project uses [node-lz4](https://github.com/pierrec/node-lz4),
[dustjs](https://github.com/linkedin/dustjs),
[multi.js](https://github.com/fabianlindfors/multi.js),
and [CodeMirror](https://github.com/codemirror/CodeMirror) libs.
They are inside the source code and no need to advance installing.
Their licenses inside a ```LICENSES``` source code directory.

##### TODO
1. Use [Emscripten](http://kripken.github.io/emscripten-site/)
to convert C++ lz4 lib to JS ([asm.js](https://developer.mozilla.org/en-US/docs/Games/Tools/asm.js))
2. Replace an estimate of uncompressed file size of lz4
by proper formula

##### Links
1. Format description and lz4 lib list is [here](https://github.com/lz4/lz4)  
2. lz4 archiver on js is [here](https://github.com/pierrec/node-lz4)
3. node-mozlz4a is a node.js lib to work with mozlz4 is [here](https://github.com/piroor/node-mozlz4a) (I didn't use it)
4. mozlz4 format description is [here](https://dxr.mozilla.org/mozilla-central/rev/2535bad09d720e71a982f3f70dd6925f66ab8ec7/toolkit/components/lz4/lz4.js#54)
5. A good article about lz4 is [LZ4 Data Compression](https://www.brutaldeluxe.fr/products/crossdevtools/lz4/index.html)

##### lz4 links
1. https://github.com/lz4/lz4/issues/276#issuecomment-262789645
2. https://github.com/lz4/lz4/wiki/lz4_Frame_format.md

#### moz specific lz4
1. https://hg.mozilla.org/mozilla-central/file/a9a24a28013b/toolkit/mozapps/extensions/AddonManagerStartup.cpp
2. https://hg.mozilla.org/mozilla-central/rev/a9a24a28013b
3. https://raw.githubusercontent.com/mozilla/gecko-dev/40e8eb46609dcb8780764774ec550afff1eed3a5/toolkit/mozapps/extensions/AddonManagerStartup.cpp