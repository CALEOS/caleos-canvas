## caleos-canvas

A pixel painting dApp on the EOS blockchain using Vue + webpack

### Dependencies

npm version `6.1.0^` <br/>
node version `9.4.0^`

### Installation
clone repository<br/>
`git clone https://github.com/CALEOS/caleos-canvas.git` <br/>

navigate to project root directory<br/>
`cd caleos-canvas` <br/>

install project dependencies<br/>
`npm install` <br/>

### Running caleos-canvas

run dev build with hot-reloading<br />
`npm run dev`<br />

run linter<br />
`npm run lint`<br />

run linter auto-fix<br />
`npm run lint:fix`<br />

### Running Tests

run jest tests<br />
`npm run test`  

### File Structure
<pre>
├── ...
├──assets                       #global styles
├──build   
│   └──webpack.config.dev.js    # webpack build configuration        
├──src                           
│   ├──\__tests__               # Jest tests     
│   ├──components               # components parent dir
│   ├──js                       # external js & 3rd party    
│   ├──pages                    # page root instances
│   ├──router                   # routes & nav   
│   ├──App.vue                  # root app component
│   ├──index.js                 # entry point
│   └── img                     # immages
├──static                       # static assets //TODO move to assets dir
│   └── img                     # images
├── index.html                  # doc root
└── ...
</pre>
