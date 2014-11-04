angular-yahoo-pipes
===================

An angular.js directive to fetch and display Yahoo Pipes!

This directive dedicated to be reusable and very extensible.

The directive has been built with modularity and testability in mind. It consists of different services that has it's own and only one responsability and doing it well.

## Example

If you want to look at demo or example of using you can download the project and open [example/index.html](https://github.com/dmytroyarmak/angular-yahoo-pipes/blob/master/example/index.html) in you browser or you can just use this link:

### [Demo](http://dmytroyarmak.github.io/angular-yahoo-pipes/example) (Warning: Sometimes Yahoo Pipes API is working unstable and can failed or return zero items for used pipe)

## How to use

To use this directive in your project you should:

1. Copy dist directory to your project's assets or install `angular-yahoo-pipes` using Bower:
  ```
  bower install angular-yahoo-pipes
  ```
  
2. Add script file from dist directory to your application:
  ```
  <script src="path_to_library/dist/angular-yahoo-pipes.js"></script>
  ```

3. Add `dyYahooPipes` module as dependency to your application:
  ```
  angular.module('myApp', ['dyYahooPipes']);
  ```

4. You can write your own CSS styles or use the existing theme:
  ```
  <link rel="stylesheet" href="../dist/angular-yahoo-pipes.css">
  ```

5. Just insert directive anywhere you want:
  ```
  <div class="container">
    <dy-yahoo-pipes pipe-id="IDwA0nTK2xGv8oU0JhOy0Q"></dy-yahoo-pipes>
  </div>
  ```

## Documentation

The code of the directive has ngDoc documentation. You can see it in [src/angular-yahoo-pipes.js](https://github.com/dmytroyarmak/angular-yahoo-pipes/blob/master/src/angular-yahoo-pipes.js) file.
Generating HTML documentation is planned as a improvement for this project.

## Testing

The code of `angular-yahoo-pipes` directive is covered by unit tests.
Tests are written using Jasmine and angular-mocks.
Karma is using as test runner for unit tests.
To run tests you can use karma-cli or grunt task (make sure that you install node modules and bower components before):
```
grunt test
```

## Developing

Grunt is used as task manager for this project. To run tests or build project you need to have node.js installed in your environment.
After that nessessary npm modules and bower components should be installed:
```
npm install
bower install
```
Also you should install grunt-cli globally to use `grunt` in your console:
```
npm install -g grunt-cli
```

After that you can use all grunt tasks. For example:
- `grunt build` to build js and less to dist folder
- `grunt test` to run unit tests using karma

## Improvement plan

- [ ] pass parse functions as attribute to directive to overwrite or decorate default parsers
- [ ] improve default parser functions to manage more types of pipes
- [ ] improve error managing and logging
- [ ] add chosing of pipe to example
- [ ] write second CSS theme
- [ ] add chosing of theme to example
