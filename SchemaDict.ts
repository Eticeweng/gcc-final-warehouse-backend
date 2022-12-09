export default {
    "/auth": {
        body: ["userBeacon", "authInfo"]
    },
    "/authMethod": {
        query: ["userBeacon"]
    },
    "/create": {
        body: ["beacon", "token", "name", "baseDir", "permission", "authMethod"]
    },
    "/remove": {
        body: ["instance"]
    },
    "/go": {
        body: ["instance", "where"]
    },
    "/back": {
        body: ["instance"]
    },
    "/tp": {
        body: ["instance", "fullPath"]
    }
}
