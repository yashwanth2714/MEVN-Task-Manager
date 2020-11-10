const path = require('path')

module.exports = {
    outputDir: path.resolve(__dirname, '../public'),
    devServer: {
        proxy: {
            '/users': {
                target: 'http://localhost:3005'
            },
            '/tasks': {
                target: 'http://localhost:3005'
            }
        }
    },
    runtimeCompiler: true,
}