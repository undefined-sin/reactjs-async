/*global window,document,bundleRegister,Promise*/
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.scss';

function loadAsyncFile(fileName){
      return new Promise(function(success, reject){
        var script = document.createElement('script');
        script.src = fileName;
        script.type = 'text/javascript';
        script.async = true;
        script.id = fileName;
        script.onload = success;
        script.onerror = reject;
        document.body.appendChild(script);
      });
}


function loadAsyncCssFile(file){
   return new Promise(function(success, reject){
     var css = document.createElement('link');  
     css.rel = 'stylesheet';
     css.type = 'text/css';
     css.href = file;
     css.id = file;
     css.onerror = reject;
     css.onload = success;
     document.body.appendChild(css);
   });
}
(function (){
	var layout = [
      { file: 'routes.js'},
      { file: 'lib/dom.js'},
      { file: 'bootstrap/footer.js', css: 'bootstrap/footer.css'},
      { file: 'bootstrap/header.js', css: 'bootstrap/header.css'}
    ];
    
    // Static rendered, should NEVER change during the session.
    this.__GLOBAL_STATIC_CONTEXT__ = Object.freeze({
      session: {
        // Rendered by server side.
        licenseKey: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a91',
        sessionId: '3f3af1ecebbd1410ab417ec0d27bbfcb5d340e177ae159b59fc8626c2dfd9175',
        accessToken: '5270935051149081442358916296234999014127',
        bundlesUrl: './js',
        staticResourcesUrl: './css'
      },
      userContext: {
          id: 'admin',
          name: 'Adilson A.'
      }
    });
    // End of static rendered.
    
    function layoutInitializer(layoutEntries){
       return function initializeScripts(){
          var currentScript = layoutEntries.shift();
          if(!currentScript){
              return;
          }
          loadAsyncFile("js/" + currentScript.file).then(function(){
              initializeScripts();
          });
          
          currentScript.css && Promise.resolve(loadAsyncCssFile("css/" + currentScript.css));
          
          return initializeScripts;
      };    
    }
    
    layoutInitializer(layout)();
    
    function renderApp(){
        var domApi = window.domApi;
        domApi.setResources({
          jsPath: this.__GLOBAL_STATIC_CONTEXT__.session.bundlesUrl,
          cssPath: this.__GLOBAL_STATIC_CONTEXT__.session.staticResourcesUrl
        });
        var registerBundleApi = bundleRegister();
        var createHeader = registerBundleApi.get('./bootstrap/header.js');
        var createFooter = registerBundleApi.get('./bootstrap/footer.js');
        var e = React.createElement;
        var mainApp = e('div',{}, createHeader({ title: 'Foo bank'}),
             e('div', { className: styles.Container}, domApi.Router({
              routes: this.applicationRoutes,
               bundleRegister: registerBundleApi,
               loadingRender: e('span', {
               className: styles.loader
                 }, null
                )
            })),
            createFooter({ title: ''})
          
          );
          ReactDOM.render(mainApp, document.querySelector('#application'));
    }
    window.onload = renderApp.bind(this);
    
    
    
    
}).bind(window)();

