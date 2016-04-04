module.exports = function(grunt){

 grunt.initConfig({

    pkg:grunt.file.readJSON("package.json"),

    sass: {
      dist: {
        files: {
          'public/dist/css/main.min.css' : 'public/assets/sass/main.scss'
        }
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      build: {
        src: 'public/dist/css/main.min.css',
        dest: 'public/dist/css/main.min.css'
      }
    },

    watch: {
     options: { livereload: true, nospawn: true },
      css: {
	     files: ['**/*.scss', 'public/dist/css/*.css'],
	     tasks: ['sass','cssmin']
	    }
	},
	
 });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch', 'cssmin']);

};