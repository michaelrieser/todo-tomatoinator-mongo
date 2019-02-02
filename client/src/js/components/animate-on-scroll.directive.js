function animateOnScroll() {
    'ngInject';

    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            const animationClass = attrs.animateOnScroll;
            // IntersectionObserver DOCS => https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#A_simple_example
            const options = {
                root: null, // null => viewport
                // rootMargin: '0', // similar to CSS margin, grow/shrink root element's bounding box
                // threshold: 1.0 // 1.0 => 100% of element must be visible || Array => run each time visibility passes element in array (ex: [0, 0.50, 1.0]) 
                threshold: 0.15
            }

            const observer = new IntersectionObserver(triggerAnimate, options); // <callback>, <options-object>            
            const tgtElement = angular.element(element)[0];
            observer.observe(tgtElement);

            function triggerAnimate(entries) { 
                // console.log('*** element: ', element[0].getElementsByClassName('top-feature-title')[0].textContent.replace(/^\s+|\s+$/g, ''));                
                // changes => list of IntersectionObserverEntry objects
                entries.forEach( (entry) => {
                    // NOTE: called once when defined & again when options.threshold is reached
                    if (entry.intersectionRatio > .15) { 
                        element.addClass(animationClass);
                    } 
                })
            }
        }
    }
}

export default animateOnScroll;