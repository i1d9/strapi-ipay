module.exports = {
    routes: [
        { // Path defined with a regular expression
            method: 'GET',
            path: '/sales/:id/status', // Only match when the URL parameter is composed of lowercase letters
            handler: 'sale.checkStatus',
            
        }
    ]
}
