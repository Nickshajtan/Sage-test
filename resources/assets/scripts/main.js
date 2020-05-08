// import external dependencies
import 'jquery';

// Import everything from autoload
import './autoload/**/*'

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import aboutUs from './routes/about';

// import then needed Font Awesome functionality
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
// import the Facebook, Vimeo, Youtube and Twitter icons
// import { faFacebookF, faVimeoV, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

// execution of imports addictions
runAddictions();

function runAddictions(){
    /** Populate Router instance with DOM routes */
    const routes = new Router({
      // All pages
      common,
      // Home page
      home,
      // About Us page, note the change from about-us to aboutUs.
      aboutUs,
    });

    // Load Events
    jQuery(document).ready(() => routes.loadEvents());

    // add the imported icons to the library
    library.add(fab);

    // tell FontAwesome to watch the DOM and add the SVGs when it detects icon markup
    dom.watch();
}
