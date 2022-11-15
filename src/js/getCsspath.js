''
import elementCssPath from './cssPathGenerator';
export default (function() {
    return {
        methods: {
            generateCssSelectorOptimised: function(element) {
                return new elementCssPath().getPath({
                    relativeNode: element,
                    fullPath: true,
                    highLight: true
                });
            },

            generateCssSelector: function(element) {
                return new elementCssPath().getPath({
                    relativeNode: element,
                    highLight: true
                });
            },
        }
    }
}());
