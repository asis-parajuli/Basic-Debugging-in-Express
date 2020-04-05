# Basic-Debugging-in-Express

Debugging using npm package debug.  (npm i debug)
https://www.npmjs.com/package/debug

Main benefit of using npm package debug is it color codes different namespaces.

we initially add import debug after installation using require.

then on the terminal or cmd we type :
  set DEBUG=app:startup     (windows)
  export DEBUG=app:startup  (mac)
  
  and we simply run the application using nodemon or node as below:
    nodemon index.js
    or node index.js
    

to remove debug information 
set DEBUG=


for adding multiple namesapces 
  set DEBUG=app:startup, app:db
  (as app:db is for debugging database related stuff)
  

we can use wildcard to use all the debugging funtions as 
  set DEBUG=app:*
  
  
for debugging at runtime we simply use:
  DEBUG=app:startup nodemon index.js
