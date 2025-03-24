async function logoutController(req, res) {
    try {
        res.clearCookie("token")
        res.clearCookie("access-token")
        res.json({
            message: "logout successfull",
            error: false,
            success: 'true',
            data: []
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
        
    }
    
}
module.exports = logoutController