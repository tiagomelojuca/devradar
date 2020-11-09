module.exports = function(arrayAsString) {
    return arrayAsString.split(',').map( tech => tech.trim() );
}