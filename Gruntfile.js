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
      dist: {
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
    },
    less: {
      dist: {
        src: 'src/<%= pkg.name %>.less',
        dest: 'tmp/style.css'
      }
    },
    autoprefixer: {
      dist: {
        src: '<%= less.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    cssmin: {
      dist: {
        src: '<%= autoprefixer.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },
    watch: {
      js: {
        files: ['src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.tpl.html'],
        tasks: 'build:js'
      },
      css: {
        files: 'src/<%= pkg.name %>.less',
        tasks: 'build:css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build:js', ['jshint', 'ngtemplates', 'ngAnnotate', 'concat', 'uglify']);
  grunt.registerTask('build:css', ['less', 'autoprefixer', 'cssmin']);

  // Default task.
  grunt.registerTask('default', ['build:js', 'build:css']);
};
