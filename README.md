##### What it's
mozlz4 editor

##### Description

The mozlz4 is a lz4 format with Mozilla's magic header.

##### Dependencies

This project uses [node-lz4](https://github.com/pierrec/node-lz4) and [CodeMirror](https://github.com/codemirror/CodeMirror) libs.
They are inside the source code and no need to advance installing.
Their licenses inside a ```LICENSES``` source code directory.

##### TODO
1. Use [Emscripten](http://kripken.github.io/emscripten-site/)
to convert C++ lz4 lib to JS (asmjs)
2. Replace an estimate of uncompressed file size of lz4
by proper formula
3. Convert mozlz4 to lz4 and lz4 to mozlz4 functionality

##### Links
1. Format description and lz4 lib list is [here](https://github.com/lz4/lz4)  
2. lz4 archiver on js is [here](https://github.com/pierrec/node-lz4)
3. node-mozlz4a node.js lib to work with mozlz4 is [here](https://github.com/piroor/node-mozlz4a) (I didn't use it)
4. mozlz4 format description is [here](https://dxr.mozilla.org/mozilla-central/rev/2535bad09d720e71a982f3f70dd6925f66ab8ec7/toolkit/components/lz4/lz4.js#54)
5. A good article about lz4 is [LZ4 Data Compression](https://www.brutaldeluxe.fr/products/crossdevtools/lz4/index.html)

##### lz4 links
1. https://github.com/lz4/lz4/issues/276#issuecomment-262789645
2. https://github.com/lz4/lz4/wiki/lz4_Frame_format.md