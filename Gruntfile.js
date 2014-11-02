/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      source: {
        src: 'src/**/*.js'
      }
    },
    ngtemplates: {
      dist: {
        src: '<%= pkg.name %>.tpl.html',
        dest: 'tmp/templates.js',
        cwd: 'src',
        options: {
          module: 'dyYahooPipes'
        }
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'tmp/annotated.js',
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['<%= ngAnnotate.dist.dest %>', '<%= ngtemplates.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Default task.
  grunt.registerTask('default', ['jshint', 'ngtemplates', 'ngAnnotate', 'concat', 'uglify']);
};
